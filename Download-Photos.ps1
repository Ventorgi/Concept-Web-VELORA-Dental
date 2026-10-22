$ErrorActionPreference = 'Stop'
$photoList = Get-Content -Raw -LiteralPath (Join-Path $PSScriptRoot 'assets/photos.json') | ConvertFrom-Json
foreach ($photo in $photoList) {
    $destination = Join-Path $PSScriptRoot ('assets/images/' + $photo.name + '.webp')
    if (Test-Path -LiteralPath $destination) { continue }
    $source = 'https://images.pexels.com/photos/' + $photo.id + '/pexels-photo-' + $photo.id + '.jpeg?auto=compress&cs=tinysrgb&w=1600&q=80&fm=webp'
    Invoke-WebRequest -Uri $source -OutFile $destination -TimeoutSec 40
    Write-Output ('Downloaded ' + $photo.name)
}
