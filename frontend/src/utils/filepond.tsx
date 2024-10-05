// import { FilePond, registerPlugin } from 'react-filepond';

// import 'filepond/dist/filepond.min.css';

// import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
// import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
// import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// registerPlugin(
//     FilePondPluginImagePreview,
//     FilePondPluginImageExifOrientation,
//     FilePondPluginFileEncode,
// );

// const Filepond = ({ files, setFiles, allowMultiple = false }: any) => {
//     return (
//         <FilePond
//             files={files}
//             onupdatefiles={setFiles}
//             name="files"
//             labelIdle="Agregar imagen"
//             credits={false}
//             allowMultiple={allowMultiple}
//             allowFileEncode
//             labelFileLoading="Cargando"
//             labelFileLoadError="Error al cargar el archivo"
//             labelTapToCancel="Click para cancelar"
//             labelFileWaitingForSize="Calculando tamaño del
//                           archivo"
//         />
//     );
// };

// export default Filepond;
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageExifOrientation,
    FilePondPluginFileEncode,
);

const Filepond = ({ files, setFiles, allowMultiple = false }: any) => {
    console.log(files);
    return (
        <FilePond
            files={files}
            onupdatefiles={setFiles}
            name="files"
            labelIdle="Agregar imagen"
            credits={false}
            allowMultiple={allowMultiple}
            allowFileEncode
            labelFileLoading="Cargando"
            labelFileLoadError="Error al cargar el archivo"
            labelTapToCancel="Click para cancelar"
            labelFileWaitingForSize="Calculando tamaño del archivo"
        />
    );
};

export default Filepond;
