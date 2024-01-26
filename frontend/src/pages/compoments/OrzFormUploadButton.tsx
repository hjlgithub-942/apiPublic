import React, {useState} from "react";
import {message, Modal, Upload} from "antd";
import {postOss} from "@/utils/orzHttp";
import {RcFile} from "antd/lib/upload";
import {UploadFile} from "antd/lib/upload/interface";
import orzUtils from "@/utils/orzUtils";
import {ProFormUploadButton} from "@ant-design/pro-form";
import {ProFormUploadButtonProps} from "@ant-design/pro-form/lib/components/UploadButton";

/**
 * 注意传递给控件的value为字符串
 * 字符串的内容为图片的url，如果有多个图片，url用','分割
 *
 * 控件提交时候也是字符串，内容为图片的url，如果有多个图片，用','拼接
 *
 * 控件可以设置ProFormUploadButton本身所有的任意属性，会覆盖掉默认的
 */

export type OrzFormUploadProps = ProFormUploadButtonProps & {
  name:string //字段名
  maxFileSize?:number //最大文件大小，单位MB，默认为2MB
}



const OrzFormUploadButton: React.FC<OrzFormUploadProps> = (props) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  //自定义上传
  const customRequest = async (options: any) => {
    const { onSuccess, onError } = options;
    let file:any = options.file
    let params = new FormData();
    params.append("file", file);
    try{
      const url = await postOss('/oss/OSSUpload', params)
      file.url = url
      const _response = { success:true  };
      onSuccess(_response);
    }
    catch(e){
      onError()
    }

  }

  //上传前检测文件大小
  const beforeUpload = (file: RcFile) => {
    let max:number = props.maxFileSize || 2
    const isLt2M = file.size / 1024 /1024 < max;
    if (!isLt2M) {
      message.error(`文件大小不能超过${max}MB!`);
    }
    // throw new Error()
    if (isLt2M){
      return true
    }
    return Upload.LIST_IGNORE;
  }

  //将控件数据转换为提交给服务端的数据
  const transform = (fileList:UploadFile[])=>{
    let list = []
    for (let file of fileList){
      list.push(file.url)
    }
    let result:any = {}
    result[props.name] = list.toString()
    return result
  }

  const getFileName = (url:string):string=>{
    let index = url.lastIndexOf('/')
    if (index < 0){
      return url
    }
    return url.substring(index + 1)
  }

  //将服务端数转换为控件数据
  const convertValue = (value:any)=>{
    // console.log('convert', value)
    if (Array.isArray(value)){
      return value
    }
    let list:UploadFile[] = []
    if (value){
      let imgList = value.split(',')
      let index = 1
      for (let url of imgList){
        const file:UploadFile = {uid:'' + index++, status:'done', url, name:url}
        file.name = getFileName(url)
        file.thumbUrl = orzUtils.getThumbUrl(url)
        list.push(file)
      }
    }
    // console.log(list)
    return list
  }

  const onCancelPreview = () => setPreviewOpen(false);

  const onPreview = async (file: UploadFile) => {
    // if (!file.url && !file.preview) {
    //   file.preview = await getBase64(file.originFileObj as RcFile);
    // }

    console.log('onPreview', file)
    setPreviewImage(file.url || '');
    setPreviewOpen(true);
    // setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  return (
    <>
    <ProFormUploadButton
      accept="image/*"
      title = '图片上传'
      label="图片上传"
      max={1}
      listType="picture-card"
      transform={transform}
      convertValue={convertValue}
      fieldProps={{
        customRequest,
        beforeUpload,
        onPreview,
        // defaultFileList:fileList
      }}
      {...props}
    />
      <Modal open={previewOpen} footer={null} onCancel={onCancelPreview}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>)
}

export default OrzFormUploadButton;
