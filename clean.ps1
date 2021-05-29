

$ErrorActionPreference = "Stop"


$build = ".build"

$demo = ".\$build\demo" 

if($Env:CLEAN -eq "true"){
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