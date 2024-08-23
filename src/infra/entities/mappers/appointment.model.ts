import { Examination } from '@prisma/client';
import { getExaminationEnum } from '../../../shared';

export class Appointment {
  public readonly id: string;
  public readonly date: Date;
  public readonly hour: string;
  public readonly status: boolean;
  public readonly examination: Examination;
  public readonly observations: string;
  public readonly vetID: string;
  public readonly petID: string;
  public readonly ownerID: string;

  constructor(
    id: string,
    date: Date,
    hour: string,
    status: boolean,
    examination: Examination,
    observations: string,
    vetID: string,
    petID: string,
    ownerID: string
  ) {
    this.id = id;
    this.date = date;
    this.hour = hour;
    this.status = status;
    this.examination = examination;
    this.observations = observations;
    this.vetID = vetID;
    this.petID = petID;
    this.ownerID = ownerID;
  }
}
