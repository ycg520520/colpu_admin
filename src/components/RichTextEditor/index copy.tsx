/*
 * @Author: colpu
 * @Date: 2025-12-17 17:09:58
 * @LastEditors: colpu ycg520520@qq.com
 * @LastEditTime: 2025-12-18 15:08:30
 *
 * Copyright (c) 2025 by colpu, All Rights Reserved.
 */
import type { EditorOptions } from "@tiptap/core";
import { useCallback, useRef } from "react";
import {
  LinkBubbleMenu,
  RichTextEditor,
  TableBubbleMenu,
  insertImages,
  type RichTextEditorRef,
} from "mui-tiptap";
import { theme as antdTheme } from "antd";
import EditorMenuControls from "./EditorMenuControls";
import useExtensions from "./useExtensions";
import "./style.scss";
function fileListToImageFiles(fileList: FileList): File[] {
  // You may want to use a package like attr-accept
  // (https://www.npmjs.com/package/attr-accept) to restrict to certain file
  // types.
  return Array.from(fileList).filter((file) => {
    const mimeType = (file.type || "").toLowerCase();
    return mimeType.startsWith("image/");
  });
}

export default function Editor() {
  const {
    token: { colorPrimary },
  } = antdTheme.useToken();
  const extensions = useExtensions({
    placeholder: "Add your own content here...",
  });
  const rteRef = useRef<RichTextEditorRef>(null);
  const handleNewImageFiles = useCallback(
    (files: File[], insertPosition?: number): void => {
      if (!rteRef.current?.editor) {
        return;
      }

      // For the sake of a demo, we don't have a server to upload the files to,
      // so we'll instead convert each one to a local "temporary" object URL.
      // This will not persist properly in a production setting. You should
      // instead upload the image files to your server, or perhaps convert the
      // images to bas64 if you would like to encode the image data directly
      // into the editor content, though that can make the editor content very
      // large. You will probably want to use the same upload function here as
      // for the MenuButtonImageUpload `onUploadFiles` prop.
      const attributesForImageFiles = files.map((file) => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }));

      insertImages({
        images: attributesForImageFiles,
        editor: rteRef.current.editor,
        position: insertPosition,
      });
    },
    []
  );

  // Allow for dropping images into the editor
  const handleDrop: NonNullable<EditorOptions["editorProps"]["handleDrop"]> =
    useCallback(
      (view, event) => {
        if (!(event instanceof DragEvent) || !event.dataTransfer) {
          return false;
        }

        const imageFiles = fileListToImageFiles(event.dataTransfer.files);
        if (imageFiles.length > 0) {
          const insertPosition = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          })?.pos;

          handleNewImageFiles(imageFiles, insertPosition);

          // Return true to treat the event as handled. We call preventDefault
          // ourselves for good measure.
          event.preventDefault();
          return true;
        }

        return false;
      },
      [handleNewImageFiles]
    );

  // Allow for pasting images
  const handlePaste: NonNullable<EditorOptions["editorProps"]["handlePaste"]> =
    useCallback(
      (_view, event) => {
        if (!event.clipboardData) {
          return false;
        }

        const pastedImageFiles = fileListToImageFiles(
          event.clipboardData.files
        );
        if (pastedImageFiles.length > 0) {
          handleNewImageFiles(pastedImageFiles);
          // Return true to mark the paste event as handled. This can for
          // instance prevent redundant copies of the same image showing up,
          // like if you right-click and copy an image from within the editor
          // (in which case it will be added to the clipboard both as a file and
          // as HTML, which Tiptap would otherwise separately parse.)
          return true;
        }

        // We return false here to allow the standard paste-handler to run.
        return false;
      },
      [handleNewImageFiles]
    );
  return (
    <RichTextEditor
      className="tiptap-rich-text-editor"
      ref={rteRef}
      extensions={extensions}
      editorProps={{
        handleDrop,
        handlePaste,
      }}
      renderControls={() => <EditorMenuControls />}
      RichTextFieldProps={{
        // The "outlined" variant is the default (shown here only as
        // example), but can be changed to "standard" to remove the outlined
        // field border from the editor
        variant: "outlined",
        MenuBarProps: {
          hide: false,
        },
        // Below is an example of adding a toggle within the outlined field
        // for showing/hiding the editor menu bar, and a "submit" button for
        // saving/viewing the HTML content
        footer: null,
      }}
    >
      {() => (
        <>
          <LinkBubbleMenu />
          <TableBubbleMenu />
        </>
      )}
    </RichTextEditor>
  );
}
