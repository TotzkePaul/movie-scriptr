$ErrorActionPreference = "Stop"

# Hack for setting env vars from .env 
$envFile = Get-Content '.\.env'
$settings = @{}
foreach ($config in $envFile) {
    $kvp = $config.split('=')
    $settings.add($kvp[0],$kvp[1])
}

$build = ".build"

$demo = ".\$build\demo" 

if($settings."CLEAN" -eq "true"){
    Write-Output "Deleting /.build/demo/"
    Remove-Item "$demo\*" -Recurse -Force -ErrorAction Ignore
} else {
    Write-Output "I was supposed to delete /.build/demo/ but Env:CLEAN was not 'true'"
}



# $config =  Get-Content  -Raw -Path "config.json"  | ConvertFrom-Json

# foreach ($item in $config.scenes) {
#     $TARGETDIR = "$build\$item"
#     Remove-Item "$TARGETDIR\*" -Recurse -Force -ErrorAction Ignore

    
#     if(!(Test-Path -Path $TARGETDIR )){
#         New-Item -ItemType directory -Path $TARGETDIR
#     }
# }

# $build = ".build"

# $frames = ".\$build\frames" 

# Remove-Item "$frames\*" -Recurse -Force -ErrorAction Ignore