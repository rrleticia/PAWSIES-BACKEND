import { randomUUID, UUID } from 'crypto';
import { Router, Request, Response } from 'express';

const router: Router = Router();

interface Owner {
  id: UUID;
  name: String;
  phoneNumber: String;
}

let owners = new Map<String, Owner>();
const owner1: Owner = {
  id: randomUUID(),
  name: 'Leticia',
  phoneNumber: '(83) 99999-9999',
};
const owner2: Owner = {
  id: randomUUID(),
  name: 'André',
  phoneNumber: '(83) 88888-8888',
};
const owner3: Owner = {
  id: randomUUID(),
  name: 'Maysa',
  phoneNumber: '(83) 77777-7777',
};

owners.set(owner1.id, owner1);
owners.set(owner2.id, owner2);
owners.set(owner3.id, owner3);

router.get('/owners', (req: Request, res: Response) => {
  res.status(200).json(owners);
});

router.get('/owners/:id', (req: Request, res: Response) => {
  const owner = owners.get(req.params.id);
  if (!owner) return res.status(404).send('Owner not found');
  res.status(200).json(owner);
});

router.post('/owners/', (req: Request, res: Response) => {
  const body = req.body();
  const newOwner: Owner = {
    id: randomUUID(),
    name: body.name,
    phoneNumber: body.phoneNumber,
  };
  owners.set(newOwner.id, newOwner);
  res.status(201).json(newOwner);
});

router.put('/owners/:id', (req: Request, res: Response) => {
  const body = req.body();
  let owner = owners.get(req.params.id);
  if (!owner) return res.status(404).send('Owner not found');
  owner.name = body.name;
  owner.phoneNumber = body.phoneNumber;
  owners.set(req.params.id, owner);
  res.status(201).json(owner);
});

router.patch('/owners/:id', (req: Request, res: Response) => {
  const owner = owners.get(req.params.id);
  if (!owner) return res.status(404).send('Owner not found');
  req.body();
  owners.set(req.params.id, owner);
  res.status(200).json(owner);
});

router.delete('/owners/:id', (req: Request, res: Response) => {
  const owner = owners.get(req.params.id);
  if (!owner) return res.status(404).send('Owner not found');
  else res.status(204).send('Owner deleted sucessfully.');
});

export default router;
