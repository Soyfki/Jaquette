// JXA shipped with macOS, no Python/Node/Xcode installation required.
// Only explicitly selected fields leave this process; no raw profiler output saved.
function run(argv) {
  var app = Application.currentApplication()
  app.includeStandardAdditions = true
  var missing = []
  function read(label, command) {
    try { return app.doShellScript(command) } catch (e) { missing.push(label); return null }
  }
  function sys(key) { return read(key, '/usr/sbin/sysctl -n ' + key) }
  var displays = [], audio = []
  try {
    var raw = JSON.parse(read('gpu/display', '/usr/sbin/system_profiler SPDisplaysDataType -json'))
    displays = (raw.SPDisplaysDataType || []).map(function(g) {
      return { model: g.sppci_model, cores: g.sppci_cores, vram: g.spdisplays_vram,
        displays: (g.spdisplays_ndrvs || []).map(function(d) { return { name: d._name, resolution: d._spdisplays_resolution, pixels: d._spdisplays_pixels, refreshHz: d.spdisplays_refresh_rate, main: d.spdisplays_main } }) }
    })
  } catch (e) { missing.push('gpu/display parsing') }
  try {
    var sound = JSON.parse(read('audio', '/usr/sbin/system_profiler SPAudioDataType -json'))
    audio = (sound.SPAudioDataType || []).map(function(a) { return { devices: (a._items || []).map(function(d) { return { name: d._name, sampleRate: d.coreaudio_device_srate, output: d.coreaudio_default_audio_output_device, transport: d.coreaudio_device_transport } }) } })
  } catch (e) { missing.push('audio parsing') }
  var browsers = [['Chrome', '/Applications/Google Chrome.app'], ['Firefox', '/Applications/Firefox.app'], ['Safari', '/Applications/Safari.app']].map(function(b) {
    var version = read(b[0] + ' version (standard location)', '/usr/bin/defaults read "' + b[1] + '/Contents/Info" CFBundleShortVersionString')
    var build = version ? read(b[0] + ' build', '/usr/bin/defaults read "' + b[1] + '/Contents/Info" CFBundleVersion') : null
    return { name: b[0], version: version, build: build }
  })
  var storage = read('capacity/free', '/bin/df -Pk . | /usr/bin/tail -1 | /usr/bin/awk \'{print $2 " " $3 " " $4}\'')
  var result = { collectorVersion: '0.4.1', machine: argv[0], collectedAt: new Date().toISOString(),
    state: missing.length ? 'BLOCKED' : 'COLLECTED_NOT_QUALIFIED',
    hardware: { model: sys('hw.model'), cpu: sys('machdep.cpu.brand_string'), physicalCores: sys('hw.physicalcpu'), logicalCores: sys('hw.logicalcpu'), ramBytes: sys('hw.memsize'), architecture: read('arch', '/usr/bin/uname -m'), arm64Capable: sys('hw.optional.arm64') },
    os: { version: read('macOS version', '/usr/bin/sw_vers -productVersion'), build: read('macOS build', '/usr/bin/sw_vers -buildVersion') },
    storage: { capacityUsedAvailableKiB: storage, solidState: read('SSD', '/usr/sbin/diskutil info / | /usr/bin/awk -F: \'/Solid State/ {gsub(/^ +/, "", $2); print $2}\'') },
    gpuAndDisplay: displays, audioDevices: audio, browsers: browsers,
    power: read('power', '/usr/bin/pmset -g batt | /usr/bin/head -1'),
    backgroundProcessCount: read('process count', '/bin/ps -A -o pid= | /usr/bin/wc -l'),
    limitations: ['No serial/UUID/network/hostname/user/process arguments saved', 'Actual screen Hz, audio route, maintenance and background activity require observation', 'APFS df is available filesystem space, not proof of unshared physical allocation', 'Architecture must be native; x86_64 with arm64Capable=1 means Rosetta and needs native rerun'], missing: missing }
  result.state = missing.length ? 'BLOCKED' : 'COLLECTED_NOT_QUALIFIED'
  return JSON.stringify(result, null, 2)
}
