export interface ToyModel {
  toyId: number;
  name: string;
  permalink: string;
  description: string;
  typeId: number;
  ageGroupId: number;
  targetGroup: 'dečak' | 'devojčica' | 'svi';
  productionDate: string;
  price: number;
  imageUrl: string;
  active: boolean;
  type: TypeModel;
  ageGroup: AgeGroupModel;
}

export interface TypeModel {
  typeId: number;
  name: string;
}

export interface AgeGroupModel {
  ageGroupId: number;
  name: string;
}
