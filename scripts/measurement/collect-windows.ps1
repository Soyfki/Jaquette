param(
  [ValidateSet('W18','UNASSIGNED')][string]$Machine = 'UNASSIGNED',
  [string]$OutputDirectory = $PSScriptRoot
)
$ErrorActionPreference = 'Stop'
$taskErrors = New-Object System.Collections.Generic.List[string]
function Read-Field($Label, [scriptblock]$Action) {
  try { & $Action } catch { $taskErrors.Add($Label + ': unavailable'); return $null }
}
$taskCpu = Read-Field 'cpu' { @(Get-CimInstance Win32_Processor | Select-Object Name,NumberOfCores,NumberOfLogicalProcessors,MaxClockSpeed,AddressWidth) }
$taskSystem = Read-Field 'hardware' { Get-CimInstance Win32_ComputerSystem | Select-Object Manufacturer,Model,TotalPhysicalMemory,SystemType }
$taskRam = Read-Field 'installedRam' { @(Get-CimInstance Win32_PhysicalMemory | Select-Object Capacity,Speed) }
$taskOs = Read-Field 'os' { Get-CimInstance Win32_OperatingSystem | Select-Object Caption,Version,BuildNumber,OSArchitecture }
$taskBuild = Read-Field 'osPatch' { Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion' | Select-Object DisplayVersion,UBR,EditionID }
$taskVolumes = Read-Field 'volumes' { @(Get-CimInstance Win32_LogicalDisk -Filter 'DriveType=3' | Select-Object DeviceID,Size,FreeSpace,FileSystem) }
$taskDisk = Read-Field 'storageType' { @(Get-PhysicalDisk | Select-Object MediaType,BusType,Size) }
$taskDiskMap = Read-Field 'volumeMapping' { @(Get-Partition | Where-Object DriveLetter | ForEach-Object { $taskPart=$_; $taskDrive = Get-Disk -Number $taskPart.DiskNumber; [pscustomobject]@{ drive=$taskPart.DriveLetter; diskNumber=$taskPart.DiskNumber; model=$taskDrive.FriendlyName; busType=[string]$taskDrive.BusType; sizeBytes=$taskDrive.Size } }) }
$taskGpu = Read-Field 'gpu' { @(Get-CimInstance Win32_VideoController | Select-Object Name,DriverVersion,AdapterRAM,CurrentHorizontalResolution,CurrentVerticalResolution,CurrentRefreshRate) }
$taskAudio = Read-Field 'audio' { @(Get-CimInstance Win32_SoundDevice | Select-Object Name,Status) }
$taskBattery = Read-Field 'battery' { @(Get-CimInstance Win32_Battery | Select-Object BatteryStatus,EstimatedChargeRemaining) }
$taskBrowsers = @()
foreach ($taskBrowser in @(
  @{ name='Chrome'; relative='Google\Chrome\Application\chrome.exe' },
  @{ name='Firefox'; relative='Mozilla Firefox\firefox.exe' }
)) {
  $taskVersions = @()
  foreach ($taskRoot in @($env:ProgramFiles, ${env:ProgramFiles(x86)}, $env:LOCALAPPDATA)) {
    if ($taskRoot) {
      $taskExe = Join-Path $taskRoot $taskBrowser.relative
      if (Test-Path -LiteralPath $taskExe) { $taskVersions += (Get-Item -LiteralPath $taskExe).VersionInfo.ProductVersion }
    }
  }
  $taskBrowsers += [pscustomobject]@{ name=$taskBrowser.name; versions=@($taskVersions | Select-Object -Unique); state=$(if ($taskVersions.Count) {'DETECTED'} else {'NOT_FOUND_IN_STANDARD_LOCATIONS'}) }
}
$taskCpuSample = Read-Field 'cpuSample' { (Get-CimInstance Win32_PerfFormattedData_PerfOS_Processor -Filter "Name='_Total'").PercentProcessorTime }
$taskProcesses = Read-Field 'backgroundCounts' {
  $taskAll = @(Get-Process)
  [ordered]@{ total=$taskAll.Count; chrome=@($taskAll | Where-Object ProcessName -eq 'chrome').Count; firefox=@($taskAll | Where-Object ProcessName -eq 'firefox').Count; codex=@($taskAll | Where-Object ProcessName -match '^codex').Count }
}
$taskReport = [ordered]@{
  collectorVersion='0.4.1'; machine=$Machine; collectedAt=(Get-Date).ToUniversalTime().ToString('o')
  state=$(if ($taskErrors.Count) {'BLOCKED'} else {'COLLECTED_NOT_QUALIFIED'})
  cpu=$taskCpu; hardware=$taskSystem; installedRam=$taskRam; os=$taskOs; osPatch=$taskBuild
  volumes=$taskVolumes; physicalStorage=$taskDisk; volumeMapping=$taskDiskMap; gpuAndDisplay=$taskGpu; audioDevices=$taskAudio
  battery=$taskBattery; browsers=$taskBrowsers; totalCpuPercentSingleSample=$taskCpuSample; backgroundCounts=$taskProcesses
  limitations=@('Single CPU sample is not budget B11', 'AdapterRAM from WMI can truncate large GPUs; not total GPU memory proof', 'Active audio route, display model/Hz, AC, maintenance/ESU and machine identity require human confirmation', 'Browser non-standard installations may be missed; hardware test reports actual browser', 'No network address, serial, user name, machine name, process arguments or file listing collected')
  missing=@($taskErrors)
}
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
$taskOutput = Join-Path $OutputDirectory ('resultat-' + $Machine + '-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.json')
if (Test-Path -LiteralPath $taskOutput) { throw 'Result already exists' }
$taskReport | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $taskOutput -Encoding UTF8
Write-Host ('Result saved: ' + $taskOutput)
if ($taskErrors.Count) { Write-Host 'BLOCKED: incomplete fields; transmit the JSON with the observation.'; exit 2 }
