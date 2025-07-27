'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import imageCompression from 'browser-image-compression';
import {
  CloudUpload,
  Eye,
  MoreVertical,
  Pencil,
  Search,
  Settings2,
  Trash,
  User2,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTable,
  CardTitle,
  CardToolbar,
} from '@/components/ui/card';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input, InputWrapper } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  createCommunityUser,
  deleteCommunityUser,
  getCommunityUsers,
  updateCommunityUser,
  type ICommunityUser,
  type SearchParams,
} from '@/app/actions/community-users';
import { UserDialog } from './components/user-dialog';

export default function UsersPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ICommunityUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<ICommunityUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'firstName', desc: false },
  ]);
  const [isPending, startTransition] = useTransition();

  // Fetch data using server action
  const [data, setData] = useState<{
    users: ICommunityUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);

  // Use actual data for now, can add optimistic updates later
  const displayUsers = data?.users || [];

  const columns = useMemo<ColumnDef<ICommunityUser>[]>(
    () => [
      {
        accessorFn: (row) => `${row.firstName} ${row.firstLastName}`,
        id: 'firstName',
        header: ({ column }) => (
          <DataGridColumnHeader title="Usuario" column={column} />
        ),
        cell: ({ row }) => {
          const fullName = `${row.original.firstName} ${row.original.firstLastName}`;
          const initials = `${row.original.firstName[0]}${row.original.firstLastName[0]}`;

          return (
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <Avatar>
                  <AvatarImage src={row.original.avatar || ''} alt="" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">{fullName}</span>
                <span className="text-sm font-normal">
                  Cédula: {row.original.identificationNumber}
                </span>
              </div>
            </div>
          );
        },
        size: 290,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorFn: (row) => row.mobilePhone,
        id: 'contact',
        header: ({ column }) => (
          <DataGridColumnHeader title="Contacto" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            <span className="text-sm">{row.original.mobilePhone}</span>
            <span className="text-sm">{row.original.homePhone || 'N/A'}</span>
          </div>
        ),
        size: 290,
        enableSorting: true,
        enableHiding: false,
      },

      {
        accessorKey: 'residentRole',
        id: 'resident',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Residente"
            column={column}
            className="flex justify-center w-full ml-0"
          />
        ),
        cell: ({ row }) => {
          const isInquilino = row.original.residentRole === 'Inquilino';
          return (
            <div className="flex justify-center w-full">
              <div
                className={`px-1.5 py-1 rounded-full border w-24 text-center ${
                  isInquilino
                    ? 'bg-[#F0ECFF] border-[#4921EA]/20'
                    : 'bg-[#E1FCE9] border-[#0BC33F]/20'
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    isInquilino ? 'text-[#4921EA]' : 'text-[#0BC33F]'
                  }`}
                >
                  {row.original.residentRole}
                </span>
              </div>
            </div>
          );
        },
        size: 130,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'adminRole',
        id: 'admin',
        header: ({ column }) => (
          <DataGridColumnHeader
            title="Administrador"
            column={column}
            className="flex justify-center w-full ml-0"
          />
        ),
        cell: ({ row }) => {
          const isAdmin = row.original.adminRole === 'Admin';
          return (
            <div className="flex justify-center w-full">
              <div
                className={`px-1.5 py-1 rounded-full border w-20 text-center ${
                  isAdmin
                    ? 'bg-[#E7F2FF] border-[#1379F0]/20'
                    : 'bg-transparent border-transparent'
                }`}
              >
                <span className={`text-sm font-medium`}>
                  {row.original.adminRole}
                </span>
              </div>
            </div>
          );
        },
        size: 130,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'actions',
        id: 'actions',
        header: () => (
          <div className="flex justify-center w-full">
            <span className="text-sm font-normal">Acciones</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-7 w-7" mode="icon" variant="ghost">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="start">
                <DropdownMenuItem onClick={() => console.log(row.original)}>
                  <Eye />
                  Ver
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditUser(row.original)}>
                  <Pencil />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeletingUser(row.original)}
                >
                  <Trash />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        size: 130,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: displayUsers,
    pageCount: data?.totalPages || 0,
    getRowId: (row: ICommunityUser) => row.id,
    state: {
      pagination,
      sorting,
    },
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    enableSorting: true,
  });

  const initialValues: ICommunityUser = {
    id: '',
    isPublic: false,
    avatar: '',
    firstName: '',
    secondName: '',
    firstLastName: '',
    secondLastName: '',
    nationality: 'Ecuatoriano',
    identificationType: 'Cédula',
    identificationNumber: '',
    birthDate: new Date(),
    mobilePhone: '',
    homePhone: '',
    residentRole: 'Propietario',
    adminRole: 'Usuario',
    createdAt: new Date(),
    updatedAt: new Date(),
    isTrashed: false,
    isProtected: false,
    createdByUserId: '',
    email: '',
  };

  useEffect(() => {
    const fetchData = async () => {
      const params: SearchParams = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        query: searchQuery,
        sort: sorting[0]?.id,
        dir: sorting[0]?.desc ? 'desc' : 'asc',
      };

      const result = await getCommunityUsers(params);
      setData(result);
    };

    startTransition(() => {
      fetchData();
    });
  }, [pagination.pageIndex, pagination.pageSize, searchQuery, sorting]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
  };

  // Handle save user (create or update)
  const handleSaveUser = async (
    userData: ICommunityUser & { avatarFile?: File },
  ) => {
    try {
      // Convert object to FormData
      const formData = new FormData();
      formData.append('email', userData.email);
      formData.append('firstName', userData.firstName);
      formData.append('secondName', userData.secondName || '');
      formData.append('firstLastName', userData.firstLastName);
      formData.append('secondLastName', userData.secondLastName || '');
      formData.append('nationality', userData.nationality);
      formData.append('identificationType', userData.identificationType);
      formData.append('identificationNumber', userData.identificationNumber);
      formData.append('birthDate', userData.birthDate.toISOString());
      formData.append('mobilePhone', userData.mobilePhone);
      formData.append('homePhone', userData.homePhone || '');
      formData.append('residentRole', userData.residentRole || '');
      formData.append('adminRole', userData.adminRole);

      // Handle avatar file if provided
      if (userData.avatarFile) {
        try {
          userData.avatarFile = await imageCompression(userData.avatarFile, {
            maxSizeMB: 10,
          });
        } catch (error) {
          console.error(error);
        }

        formData.append('avatarFile', userData.avatarFile);
      }

      if (userData.id) {
        await updateCommunityUser(userData.id, formData);
      } else {
        await createCommunityUser(formData);
      }

      // Refresh data
      const params: SearchParams = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        query: searchQuery,
        sort: sorting[0]?.id,
        dir: sorting[0]?.desc ? 'desc' : 'asc',
      };
      const result = await getCommunityUsers(params);
      setData(result);

      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error; // Re-throw to let the dialog handle the error display
    }
  };

  // Handle edit user
  const handleEditUser = (user: ICommunityUser) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    setIsDeleting(true);
    try {
      await deleteCommunityUser(deletingUser.id);
      // Refresh data after deletion
      const params: SearchParams = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        query: searchQuery,
        sort: sorting[0]?.id,
        dir: sorting[0]?.desc ? 'desc' : 'asc',
      };
      const result = await getCommunityUsers(params);
      setData(result);
      setDeletingUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 px-5 py-8 max-w-[1200px] mx-auto">
      <PageHeader
        title="Usuarios"
        description="Gestiona los usuarios de la comunidad, asigna roles y unidades"
        actions={
          <>
            <Button
              variant="secondary"
              size="md"
              className="bg-white border border-[#E2E4ED] shadow-sm h-[34px] px-3 py-2"
            >
              <CloudUpload className="mr-1 h-4 w-4" />
              Carga masiva
            </Button>
            <Button
              variant="primary"
              size="md"
              className="h-[34px] px-3 py-2"
              onClick={() => {
                setEditingUser(null);
                setDialogOpen(true);
              }}
            >
              <User2 className="mr-1 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </>
        }
      />

      <DataGrid
        table={table}
        recordCount={data?.total || 0}
        emptyMessage="Aún no se han registrado usuarios."
        isLoading={isPending}
      >
        <Card>
          <CardHeader className="py-3">
            <CardTitle>
              {isPending
                ? 'Cargando...'
                : `Mostrando ${data?.users?.length || 0} de ${data?.total || 0} usuarios`}
            </CardTitle>
            <CardToolbar>
              <InputWrapper>
                <Button
                  size="sm"
                  variant="dim"
                  mode="icon"
                  className="size-5 -ms-0.5"
                >
                  <Search />
                </Button>
                <Input
                  type="text"
                  placeholder="Buscar Usuario"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </InputWrapper>
              <DataGridColumnVisibility
                table={table}
                trigger={
                  <Button variant="outline" size="sm">
                    <Settings2 />
                    Filtros
                  </Button>
                }
              />
            </CardToolbar>
          </CardHeader>
          <CardTable>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>
          <CardFooter>
            <DataGridPagination />
          </CardFooter>
        </Card>
      </DataGrid>

      <UserDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingUser(null);
          }
        }}
        initialValues={editingUser || initialValues}
        onSave={handleSaveUser}
      />

      <ConfirmationDialog
        open={!!deletingUser}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeletingUser(null);
        }}
        title="Eliminar Usuario"
        description={
          deletingUser
            ? `¿Estás seguro de que quieres eliminar a ${deletingUser.firstName} ${deletingUser.firstLastName}? Esta acción no se puede deshacer.`
            : ''
        }
        onConfirm={handleDeleteUser}
        isLoading={isDeleting}
      />
    </div>
  );
}
