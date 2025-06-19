const url = `https://api.cloudinary.com/v1_1/dvr4vqnnm/image/upload`

const uploadImage  = async(image) => {
    const formData = new FormData()
    formData.append("file",image)
    formData.append("upload_preset","gkydu0ap")
    

    const dataResponse = await fetch(url,{
        method : "post",
        body : formData
    })

    return dataResponse.json()

}

export default uploadImage 