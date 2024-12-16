import apiUrls from "@/constants/apiUrls";
import { ResponseCommon } from "@/interfaces/common";
import httpService from "@/services/httpService";
import { AxiosRequestConfig, AxiosResponse } from "axios";
interface UploadFile {
    uri: string,
    fileType: string
}
export type ResponseUploadFile = AxiosResponse<ResponseCommon<UploadFile>>;

class UploadService {
    async uploadSingle(file: FormData, configs?: AxiosRequestConfig): Promise<ResponseUploadFile> {
        return await httpService.post(`${apiUrls.UPLOAD_URL}/single`,
            file,
            {
                ...configs,
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            },
        );
    }
}

export default new UploadService();
