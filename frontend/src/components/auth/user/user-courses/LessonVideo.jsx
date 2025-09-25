import React, { use } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { apiUrl, userTokenLms } from '../../../common/Config'
import { toast } from 'react-toastify'
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview,FilePondPluginFileValidateType)

export default function LessonVideo({lesson}) {
    const [files, setFiles] = React.useState([])
  return (
    <div className="bg-white p-3 rounded-xl shadow">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      Cover image
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
                  response = JSON.parse(response);
                  toast.success(response.message)
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
      {/* {
        course.course_small_image && 
        <img src={course.course_small_image} alt="Course Cover" className="mt-4 h-56 object-cover rounded w-full" />
      } */}
  </div>
  )
}
