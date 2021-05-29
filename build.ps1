$ErrorActionPreference = "Stop"

$build = ".build"

$config =  Get-Content  -Raw -Path "config.json"  | ConvertFrom-Json

# Remove-Item "$frames\*" -Recurse -Force -ErrorAction Ignore

# Copy-Item -Path ".\output\*" -Destination $buildDir

#https://ffmpeg.org/ffmpeg.html

$videos = Get-ChildItem -Path ".\$build\" -Exclude "." -Directory
$videos
$videos | ForEach-Object { Write-Output $_.FullName }
$seconds = 5
# $videos | ForEach-Object {.\.build\ffmpeg.exe -y -framerate 50 -start_number 0 -i "${$_.FullName}\%0d.png" -c:v libx264  "${$_.FullName}\$($_.Name).mp4" }


$html=@'
<!DOCTYPE html> 
<html> 
<body> 
{0}
</body> 
</html>
'@

foreach ($item in $config.scenes) {
    $fps = [int] ( Get-ChildItem ".\$build\$item\*.png" | Measure-Object ).Count/$seconds

    .\.build\ffmpeg.exe -y -framerate $fps -start_number 0 -i ".\$build\$item\%0d.png" -c:v libx264 ".\$build\$item\$item.mp4"

    $rel = "./$item/$item.mp4"
    $replacementText = '<video width="100%" controls><source src="{0}" type="video/mp4"></video>' -f $rel
    $replacementText += ' {0}'
    $html = $html -f $replacementText
}
$html = $html -f " "



#.\.build\ffmpeg.exe -y -framerate $fps -start_number 0 -i ".\$build\webgl_loader_collada_skinning\%0d.png" -c:v libx264 ".\$build\webgl_loader_collada_skinning\webgl_loader_collada_skinning.mp4"

#.\.build\ffmpeg.exe -y -framerate 5  -start_number 0 -i ".\$build\webgl_loader_collada_skinning_StopMotion\%0d.png" -c:v libx264 ".\$build\webgl_loader_collada_skinning_StopMotion\webgl_loader_collada_skinning_StopMotion.mp4"

Set-Content -Path ".\$build\index.html" -Value $html