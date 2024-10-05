import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './authentication.routes';
import userRoutes from './user.routes';
import ownerRoutes from './owner.routes';
import vetRoutes from './vet.routes';
import petRoutes from './pet.routes';
import appointmentRoutes from './appointment.routes';

export const routes = (app: any) => {
  // Apply middlewares globally
  app.use(cors());
  app.use(express.json());

  // Base route for testing
  app.route('/').get((req: Request, res: Response) => {
    res.status(200).send({ title: 'Home page Test Json' });
  });

  // Register route modules
  app.use('/auth', authRoutes);
  app.use('/user', userRoutes);
  app.use('/owner', ownerRoutes);
  app.use('/vet', vetRoutes);
  app.use('/pet', petRoutes);
  app.use('/appointment', appointmentRoutes);
};
