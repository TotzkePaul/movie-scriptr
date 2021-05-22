$ErrorActionPreference = "Stop"
#..\ffmpeg\bin\ffmpeg.exe -framerate 1 -pattern_type glob -i '*.jpg' video.mp4

$i = 1
Get-ChildItem .\output\*.jpg | %{Copy-Item $_ -Destination  ('.\test\{0}.jpg' -f $i++)}

#https://ffmpeg.org/ffmpeg.html
# -r : 

..\ffmpeg\bin\ffmpeg.exe -y -framerate 50 -start_number 1 -i .\test\%0d.jpg -c:v libx264  video.mp4