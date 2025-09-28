import React, { useEffect, useState } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { apiUrl, userTokenLms } from '../../../common/Config'
import { toast } from 'react-toastify'
import ReactPlayer from 'react-player'

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview,FilePondPluginFileValidateType)

export default function LessonVideo({lesson}) {
    const [files, setFiles] = useState([])
    const [videoUrl, setVideoUrl] = useState();

  useEffect(() => {
    if(lesson){
      setVideoUrl(lesson?.video_url);
    }
  }
  , [lesson]) 



  return (
    <div className="bg-white p-3 rounded-xl shadow">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      Lesson Video
    </h3>
    
    <FilePond
      acceptedFileTypes={['video/mp4']}
      credits={false} 
      files={files}
      onupdatefiles={setFiles}
      allowMultiple={false}
      maxFiles={1}
      server={{
          process: {
              url: `${apiUrl}/save-lesson-video/${lesson.id}`,
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${userTokenLms()}` 
              },
              onload: (response) => {
                const res = JSON.parse(response);
                console.log("response from video upload",res.data.video_url);
                toast.success(res.message);
                setVideoUrl(res.data.video_url);
                setFiles([]);
            },
              onerror: (errors) => {
                  console.log(errors)
              },
          },
      }}
      name="video"
      labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      
    />
    {
     
      videoUrl &&
      <ReactPlayer
      width="100%"
      height="100%"
      src={videoUrl}
      controls
       />
       
    }
  </div>
  )
}
