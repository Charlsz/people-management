export interface Person {
  id: number;
  avatar: string | any;
  nombre: string;
  segundoNombre: string;
  apellido: string;
  tipoDoc: string;
  documento: string;
  celular: string;
  correo: string;
  genero: string;
  fechaNacimiento: string;
}

export interface Log {
  id:number;
  dateAndHour: string;
  autor:string;
  document:string;
  typeOfAction:string;
  details:string;
}
