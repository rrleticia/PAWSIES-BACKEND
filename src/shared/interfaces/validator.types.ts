export interface Validator {
  validator:
    | 'OwnerModel'
    | 'VetModel'
    | 'PetModel'
    | 'AppointmentModel'
    | 'UserModel';
}
