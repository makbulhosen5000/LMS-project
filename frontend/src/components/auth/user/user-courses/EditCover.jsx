import React from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview,FilePondPluginFileValidateType)

export default function EditCover() {
    const [files, setFiles] = React.useState([])
    
  return (
    <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-lg font-semibold text-gray-800 mb-2">
      Edit Cover image
    </h3>
    <FilePond
    acceptedFileTypes={['image/jpeg', 'image/jpg', 'image/png']}
    credits={false} 
    files={files}
    onupdatefiles={setFiles}
    allowMultiple={false}
    maxFiles={1}
    server={{
        process: {
            url: `${apiUrl}/courses/save-course-image/${course.id}`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}` 
            },
            onload: (response) => {
                response = JSON.parse(response);
                toast.success(response.message);
                const updateCourseData = { ...course, cover_image_small: response.data.cover_image_small};
                setCourse(updateCourseData)
                setFiles([]);
            },
            onerror: (errors) => {
                console.log(errors)
            },
        },
    }}
    name="image"
    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
/>
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 cursor-pointer hover:bg-gray-50">
      Drag & Drop your files or{" "}
      <span className="text-blue-600 font-semibold">Browse</span>
    </div>
  </div>
  )
}
