'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CloudUpload, MoreVertical, Settings, User2 } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';

const users = [
  {
    name: 'Tyler Hero',
    id: '173594941-2',
    avatar: '/media/avatars/300-1.png',
    phone: '+593 930 12 4567',
    email: 'tyler.hero@gmail.com',
    unidades: 2,
    residente: 'Propietario',
    admin: 'Admin',
  },
  {
    name: 'Esther Howard',
    id: '103594941-2',
    avatar: '/media/avatars/300-2.png',
    phone: '+593 981 45 2379',
    email: 'esther.howard@gmail.com',
    unidades: 1,
    residente: 'Propietario',
    admin: 'Admin',
  },
  // ...more mock users
];

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-8 px-5 py-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-[#111B37]">Usuarios</h1>
        <div className="flex items-center gap-4">
          <span className="text-[15px] text-[#4B5675]">
            Gestiona los usuarios de la comunidad, asigna roles y unidades
          </span>
        </div>
      </div>
      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button
          variant="secondary"
          size="md"
          className="bg-white text-[#4B5675] border border-[#E2E4ED] shadow-sm"
        >
          <CloudUpload className="mr-2 h-4 w-4" />
          Carga masiva
        </Button>
        <Button variant="primary" size="md">
          <User2 className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>
      {/* Table Card */}
      <div className="bg-white rounded-xl shadow p-0 border border-[#E6E8F0]">
        {/* Table Top Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6E8F0]">
          <span className="text-sm font-medium text-[#111B37]">
            Mostrando 10 de 150 usuarios
          </span>
          <div className="flex items-center gap-4">
            <Input placeholder="Buscar Usuario" className="w-60" />
            <div className="flex gap-2">
              <Badge variant="secondary" appearance="light" size="sm">
                Status: <span className="ml-1 text-[#27314B]">Activo</span>
              </Badge>
              <Badge variant="secondary" appearance="light" size="sm">
                Ordenar:{' '}
                <span className="ml-1 text-[#27314B]">Más recientes</span>
              </Badge>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="bg-[#E7F2FF] text-[#1379F0] border border-[#1379F0]/20"
            >
              <Settings className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>
        {/* Table */}
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Unidades</TableHead>
              <TableHead>Residente</TableHead>
              <TableHead>Administrador</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-[#111B37]">
                        {user.name}
                      </div>
                      <div className="text-xs text-[#4B5675]">
                        Cédula: {user.id}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm text-[#111B37]">{user.phone}</span>
                    <span className="text-xs text-[#4B5675]">{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-[#111B37]">
                    {user.unidades}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="success" appearance="light" size="sm">
                    {user.residente}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="primary" appearance="light" size="sm">
                    {user.admin}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-5 w-5 text-[#78829D]" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Table Footer / Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#E6E8F0]">
          <div className="flex items-center gap-2 text-sm text-[#78829D]">
            <span>Mostrar</span>
            <Button variant="secondary" size="sm" className="px-2 py-1">
              10
            </Button>
            <span>por página</span>
            <span className="ml-4">1-10 of 150</span>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button variant="ghost" size="sm">
                  {'<'}
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-[#E6E8F0] text-[#27314B]"
                >
                  1
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button variant="ghost" size="sm">
                  2
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button variant="ghost" size="sm">
                  3
                </Button>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <Button variant="ghost" size="sm">
                  {'>'}
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
