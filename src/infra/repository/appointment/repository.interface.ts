import { Appointment } from '../../entities';

export interface IAppointmentRepository {
  findAll(): Promise<Appointment[] | undefined>;
  findAllByPetName(petID: string): Promise<Appointment[] | undefined>;
  findOneByID(id: string): Promise<Appointment | undefined>;
  save(owner: Appointment): Promise<Appointment>;
  update(id: string, Appointment: Appointment): Promise<Appointment>;
  updateStatus(id: string, status: string): Promise<Appointment>;
  delete(id: string): Promise<Appointment>;
  findAnyByVetAndOwnerWithDateAndHour(
    vetID: string,
    ownerID: string,
    date: Date,
    hour: string
  ): Promise<Appointment | undefined>;
}
