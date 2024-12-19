import { TINY_API } from "@/helpers/common";
import { Typography } from "@mui/material";
import { Editor, IAllProps } from "@tinymce/tinymce-react";
import { useFormikContext } from "formik";
import { forwardRef, useState } from "react";
import { FieldError } from "react-hook-form";

export interface Props extends IAllProps {
  height?: number;
  selector?: string;
  name?: string;
  placeholder?: string;
  field: {
    value: string;
    onChange: (value: string) => void; // Cập nhật kiểu onChange ở đây
    onBlur: () => void;
  };
  fieldState: { error?: FieldError };
  id: string;
}

// eslint-disable-next-line react/display-name
const TinyMceCommon = forwardRef((props: Props, ref: any) => {
  //! State
  const { height, initialValue, name, placeholder, value, field, fieldState } =
    props;
  const { error } = fieldState;
  //! Function
  //! Render
  return (
    <>
      <Editor
        value={value || field.value}
        apiKey={TINY_API}
        onInit={(evt, editor: any) => {
          if (editor&&ref.current) {
            ref.current = editor;
          }
        }}
        init={{
          placeholder: placeholder,
          height: height || 400,
          plugins:
            "link code table lists fullscreen preview visualblocks help ",
          menubar: "file edit view insert format tools table help",
          toolbar:
            "undo redo |blocks fontfamily fontsize lineheight | bold italic underline forecolor backcolor| alignleft aligncenter alignright alignjustify|code|bullist outdent indent | fullscreen  preview  ",
          elementpath: false,
        }}
        onEditorChange={(value) => {
          field.onChange(value);
          // if (name) {
            // setFieldValue(name, value);
          // }
        }}
        initialValue={initialValue}
        {...props}
      />
      {error && (
        <Typography style={{ color: "red", fontSize: 14 }}>
          {error.message}
        </Typography>
      )}
    </>
  );
});

export default TinyMceCommon;

// import { useEffect } from "react";
// import "tinymce/tinymce"; // Core TinyMCE
// import "tinymce/themes/silver/theme"; // Theme
// import "tinymce/icons/default/icons"; // Icons

// interface TinyMCEEditorProps {
//   field: {
//     value: string;
//     onChange: (value: string) => void; // Cập nhật kiểu onChange ở đây
//     onBlur: () => void;
//   };
//   id: string;
// }

// const TinyMCEEditor = ({ field, id }: TinyMCEEditorProps) => {
//   useEffect(() => {
//     const loadTinyMCE = async () => {
//       const tinymce = (await import("tinymce")).default;

//       // Khởi tạo TinyMCE
//       tinymce.init({
//         selector: `#${id}`,
//         base_url: "/tinymce", // Đường dẫn file tĩnh
//         height: 400,
//         branding: false,
//         plugins: "link image lists code",
//         toolbar: "undo redo | bold italic | link image | bullist numlist | code",
//         setup: (editor) => {
//           editor.on("init", () => {
//             // Cập nhật giá trị khi TinyMCE khởi tạo
//             editor.setContent(field.value || "");
//           });

//           // Cập nhật giá trị khi người dùng thay đổi nội dung
//           editor.on("change", () => {
//             // Truyền giá trị chuỗi vào onChange
//             field.onChange(editor.getContent());
//           });
//         },
//       });
//     };

//     loadTinyMCE();

//     // Cleanup để TinyMCE không bị khởi tạo lại
//     return () => {
//       const tinymce = (window as any).tinymce;
//       if (tinymce) {
//         tinymce.remove(`#${id}`);
//       }
//     };
//   }, [field.value, id, field.onChange]);

//   return <textarea id={id} value={field.value} />;
// };

// export default TinyMCEEditor;
