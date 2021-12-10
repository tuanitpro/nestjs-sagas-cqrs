export class PaginationModel {
  data: any[];

  metadata?: MetaDataModel;
}

export class MetaDataModel {
  total: number;
  
  page: number;

  limit: number;
}
