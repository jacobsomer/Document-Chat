export type UploadUrlProps = {
    input: string,
    chatId: string,
    updateFiles: (chatId: string) => Promise<void>,
    successCallback: () => Promise<void>,
    clientErrorCallback: () => Promise<void>,
    serverErrorCallback: () => Promise<void>,
}

export const uploadUrl = async (props: UploadUrlProps) => {
    const enpointURL = '/api/upload/handleUrlUpload';
    const response = await fetch(enpointURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: props.input, chatId: props.chatId })
    });
    console.log(response);
    if (!response.ok) {
      return await props.clientErrorCallback();
    }
    const resp = (await response.json()) as { message: string };
    console.log(resp);
    if (resp.message === 'File uploaded successfully') {
      await props.updateFiles(props.chatId);
      const closeModal = document.getElementById('closeModal');
      if (closeModal) {
        closeModal.click();
      }
      return await props.successCallback();
    } else {
       return await props.serverErrorCallback();
    }
}