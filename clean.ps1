Write-Output "I am supposed to delete /.build/frames/"

$ErrorActionPreference = "Stop"

$build = ".build"

$frames = ".\$build\frames" 

Remove-Item "$frames\*" -Recurse -Force -ErrorAction Ignore