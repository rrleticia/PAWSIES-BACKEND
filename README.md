# PAWSIES - BACKEND

'PAWSIES ≽^•⩊•^≼!!' is a Clinic Management for Pets!
The appointments includes only cats and dogs, for now.

## INFO

PAWSIES ≽^•⩊•^≼!! aims to provide the service of healthcare for pets, specifically,
dogs and cats, when the owners need a medical checkup at the PAWSIES ≽^•⩊•^≼!! Clinic.
As such, owners of pets can book health checkups according to their distinct needs,
be those for a pet cat or a pet dog. 

## BACKEND ROUTES

- auth/
- owner/
- vet/
- pet/
- appointment/


## FRONTEND ROUTES

- login/
- home/
- appointment/
- vet/
- pet/
- owner/
- user/

## DOCUMENTATION
- entrega 1 (https://docs.google.com/document/d/1SDKefM5RHEUNsIv23nSw6riFDGCctIojHVoBdAYYDB8/edit?usp=sharing)
- testes (https://docs.google.com/document/d/1iTDN5SrSjk2m8jJwYp8Gxs55PFvXvfZ6nNxrpOkwS8k/edit?usp=sharing)
- entrega 3 (https://docs.google.com/document/d/1Vemk6alS1jVOZrfTvhnjWCRV7ilI_-k0U7MubTmUWgc/edit?usp=sharing)

## SWAGGER API
- swagger mocked api (https://app.swaggerhub.com/apis/LETICIARR2002/PAWSIES/1.0.0#/pet)

## Important Resources
- Backend (https://github.com/rrleticia/PAWSIES-BACKEND) done in Express Typescirpt with libraries such as Prisma, Joi, Jwt and Gulp 
- Fronted (https://github.com/rrleticia/PAWSIES-FRONTEND) done in React.JS with Typescirpt utilizing libraries such as Material-UI v5, Joi, Vite, Axios
- Database used is PostgreSQL in a Docker container comes from the following

---

## HOW TO RUN APPLICATION

1. First, ensure that you have Docker Desktop installed.
2. If necessary, pull PostgreSQL to Docker, but it shouldn't be necessary.
3. Run Docker before doing anything, it is essential that Docker is composed.
4. Run the docker command `docker-compose up -d`, other commands should not work as well.
5. Now, download the backend from the following link (https://github.com/rrleticia/PAWSIES-BACKEND)
6. With docker running, open the backend folder and run `nmp run dev`
7. Wait for gulp to compile and run the backend successfully.
8. Now, download the frontend from the following link (https://github.com/rrleticia/PAWSIES-FRONTEND)
9. With the backend running, open the frontend folder and run `nmp run dev`
10. Wait for vite to compile and run the frontend successfully.

By the end of this you should be able to use both backend and frontend.
* Backend is running on http://localhost:8080. You should be able to access it with Postman or with the Frontend.
* Frontend is runing on http://localhost:4200. You should be able to access it with any browser chosen, I develop the application with OperaGX.

---

## AUTHOR

Part of the project done for a subject in Web Development for UFCG.
&copy; 2024 Leticia Ramos Rodrigues. All rights reserved.
