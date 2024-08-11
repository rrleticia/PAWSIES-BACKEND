import express, { Request, Response } from 'express';
import cors from 'cors';
import ownerRoutes from '../owner/routes';

export const routes = (app: any) => {
  //Teste de rota base
  app.route('/').get((req: Request, res: Response) => {
    res.status(200).send({ title: 'Home page Test Json' });
  });

  app.use(cors()).use(express.json()).use('/owner', ownerRoutes);
};
