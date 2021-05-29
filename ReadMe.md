# 📺 Movie-Scriptr 

This movie maker takes json as input and creates an mp4.

VS Code is recommended for this repo because of the Launch.json and Tasks.json


### Youtube Demo


[![Watch the video](https://i9.ytimg.com/vi/x2OzCcrq6XI/mq2.jpg?sqp=CLTwyoUG&rs=AOn4CLDK6oJUBAgRLOPd6I7Ju_WiVedJoQ)](https://www.youtube.com/watch?v=x2OzCcrq6XI)

https://www.youtube.com/watch?v=x2OzCcrq6XI

### Dependancies:

* FFmpeg https://github.com/BtbN/FFmpeg-Builds/releases/tag/autobuild-2021-05-29-13-01 Choose ffmpeg-N-102620-g3300625c6f-win64-gpl.zip
* Default location is its a sibling with this repo (they should be in the same folder)

Example of config.json for the video to be based on:

```json
{
    "videos" : [
        { 
            "name": "demo", 
            "type": "mp4",
            "fps": 30,
            "baseurl": "https://threejs.org/examples/",
            "source": "../video_assets/",
            "scenes":[          
                {"page":"css3d_periodictable.html", "duration": 3000},      
                {"page":"webgl_loader_collada_skinning.html", "duration": 5000},
                {"page":"webgl_effects_parallaxbarrier.html", "duration": 10000},
                {"page":"webgl_lines_sphere.html", "duration": 5000},
                {"page":"webgl_test_memory.html", "duration": 3000},
                {"page":"webgl_buffergeometry_selective_draw.html", "duration": 3000},
                {"page":"webgl_postprocessing_glitch.html", "duration": 3000},
                {"page":"webgl_custom_attributes.html", "duration": 3000},
                {"page":"webxr_vr_rollercoaster.html", "duration": 60000},                
                {"page":"css3d_sprites.html", "duration": 3000},
                {"page":"webgl_loader_fbx.html", "duration": 3000},
                {"page":"webgl_points_dynamic.html", "duration": 3000}
            ]
        }
    ]
}
```

This tool is recording each page
Example https://threejs.org/examples/webgl_loader_collada_skinning.html


These pages are Three.js Demos

The Future goal is finish this as a full stop animation studio.

## TODO
* Add Audio
* Add SlideShow



## Old ReadMe (Ignore)

This is the human version of the animation. (If you wait a couple minutes for the planets back.):
https://totzkepaul.github.io/


Video.mp4:

https://youtu.be/_qzZHwnw4jg


Source Code for my gh-page: 

https://github.com/TotzkePaul/totzkepaul.github.io

This collects the frames by calling moveCamera() and screenshot in a loop:

https://github.com/TotzkePaul/movie-scriptr/blob/master/index.js


Takes the Frame Directories and makes the video file:

https://github.com/TotzkePaul/movie-scriptr/blob/master/build.ps1


My moveCamera() is similar to (mine got minified):

https://github.com/fireship-io/threejs-scroll-animation-demo/blob/main/main.js