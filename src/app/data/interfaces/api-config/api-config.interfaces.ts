enum ApiUrlEnum {
  Get_Authentication_Token,
  Get_Authorized_User_Profile,
  Upload_Files_To_Cloud,
  Order_List,
  Order_By_Search_List,
  Order_By_Int_Id,
  Order_By_Ext_Id,
  Create_Order,
  Edit_Order,
  Delete_Order,
  User_List,
  User_List_FF,
  User_By_Id,
  User_Search,
  Add_Order_Comment,
  Add_Order_Floor,
  Add_Order_Attachment,
  Add_Order_Floor_Attachment,
  Add_Order_Floor_Data,
  Add_Order_Logo_Watermark,
  Delete_Order_Floor,
  Delete_Order_Floor_Data,
  Delete_Order_Attachment,
  Delete_Order_Logo_Attachment,
  Delete_Order_Watermark_Attachment,
  Send_Order_Action,
  Deliver_Order,
  Assign_User_To_Order,
  Emergency_Unassign_User,
  Change_Order_Priority,
  Log_Order_Work_Time
}

export type ApiUrlType = keyof typeof ApiUrlEnum;

export interface IApiURLConfig {
  urlType: ApiUrlType;
  urlData?: {
    userId?: string;
    orderId?: string;
    floorId?: string;
    floorNumber?: string;
    attachmentId?: string;
    searchInput?: string;
  }
};
