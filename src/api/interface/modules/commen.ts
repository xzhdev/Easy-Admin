//公用模块
export module Business {
  type Business = {
    businessId: number;
    businessName: string;
    businessType: string;
  };
  //业务模块
  export interface ResBusiness extends Business {
    //业务名称
    subBusiness: Business[];
    [property: string]: any;
  }
}
