import express, { Request, Response } from 'express';
import cors from 'cors';
import ownerRoutes from './owner.routes';
import vetRoutes from './vet.routes';
import petRoutes from './pet.routes';
import appointmentRoutes from './appointment.routes';

export const routes = (app: any) => {
  //Teste de rota base
  app.route('/').get((req: Request, res: Response) => {
    res.status(200).send({ title: 'Home page Test Json' });
  });

  app.use(cors()).use(express.json()).use('/owner', ownerRoutes);
  app.use(cors()).use(express.json()).use('/vet', vetRoutes);
  app.use(cors()).use(express.json()).use('/pet', petRoutes);
  app.use(cors()).use(express.json()).use('/appointment', appointmentRoutes);
};
