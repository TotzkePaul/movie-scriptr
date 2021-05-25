$ErrorActionPreference = "Stop"

$build = ".build"

$frames = ".\$build\frames" 

# Remove-Item "$frames\*" -Recurse -Force -ErrorAction Ignore

# Copy-Item -Path ".\output\*" -Destination $buildDir

#https://ffmpeg.org/ffmpeg.html

.\.build\ffmpeg.exe -y -framerate 30 -start_number 0 -i $frames\%0d.png -c:v libx264  video.mp4