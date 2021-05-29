Write-Output "I am supposed to delete /.build/frames/"

$ErrorActionPreference = "Stop"


$build = ".build"

$config =  Get-Content  -Raw -Path "config.json"  | ConvertFrom-Json

foreach ($item in $config.scenes) {
    $TARGETDIR = "$build\$item"
    Remove-Item "$TARGETDIR\*" -Recurse -Force -ErrorAction Ignore

    
    if(!(Test-Path -Path $TARGETDIR )){
        New-Item -ItemType directory -Path $TARGETDIR
    }
}

# $build = ".build"

# $frames = ".\$build\frames" 

# Remove-Item "$frames\*" -Recurse -Force -ErrorAction Ignore