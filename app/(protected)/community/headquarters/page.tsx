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
import { Eye, MoreVertical, Pencil, Search, Trash } from 'lucide-react';
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
  createHeadquarters,
  deleteHeadquarters,
  getHeadquarters,
  updateHeadquarters,
  type IHeadquarters,
  type SearchParams,
} from '@/app/actions/headquarters';
import { HeadquartersDialog } from './components/headquarters-dialog';

// Initial values for new headquarters
const initialValues: IHeadquarters = {
  id: '',
  avatar: '',
  type: '',
  identification: '',
  address: '',
  reference: '',
  mobilePhone: '',
  homePhone: '',
  email: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  isTrashed: false,
  createdByUserId: '',
  isProtected: false,
  userAssignments: [],
};

export default function HeadquartersPage() {
  // State management
  const [data, setData] = useState<{
    headquarters: IHeadquarters[];
    total: number;
    totalPages: number;
  } | null>(null);

  const [editingItem, setEditingItem] = useState<IHeadquarters | null>(null);
  const [viewingItem, setViewingItem] = useState<IHeadquarters | null>(null);
  const [deletingItem, setDeletingItem] = useState<IHeadquarters | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'type', desc: false },
  ]);
  const [isPending, startTransition] = useTransition();

  // Table columns definition
  const columns = useMemo<ColumnDef<IHeadquarters>[]>(
    () => [
      {
        accessorKey: 'type',
        header: ({ column }) => (
          <DataGridColumnHeader title="Tipo" column={column} />
        ),
        cell: ({ row }) => <span className="text-sm">{row.original.type}</span>,
        size: 150,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'identification',
        header: ({ column }) => (
          <DataGridColumnHeader title="Nombre" column={column} />
        ),
        cell: ({ row }) => {
          const initials = `${row.original.identification[0]}`;

          return (
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <Avatar>
                  <AvatarImage src={row.original.avatar || ''} alt="" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-normal">
                  {row.original.identification}
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
        accessorKey: 'address',
        header: ({ column }) => (
          <DataGridColumnHeader title="Unidades" column={column} />
        ),
        // cell: ({ row }) => (
        //   <span className="text-sm">{row.original.address}</span>
        // ),
        cell: () => <span className="text-sm">-</span>,
        size: 200,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'email',
        header: ({ column }) => (
          <DataGridColumnHeader title="Parqueaderos" column={column} />
        ),
        cell: () => <span className="text-sm">-</span>,
        size: 200,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'mobilePhone',
        header: ({ column }) => (
          <DataGridColumnHeader title="Bodegas" column={column} />
        ),
        cell: () => <span className="text-sm">-</span>,
        size: 150,
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
                <DropdownMenuItem
                  onClick={() => handleViewHeadquarter(row.original)}
                >
                  <Eye />
                  Ver
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleEditHeadquarter(row.original)}
                >
                  <Pencil />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeletingItem(row.original)}
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

  // Table configuration
  const table = useReactTable({
    columns,
    data: data?.headquarters || [],
    pageCount: data?.totalPages || 0,
    getRowId: (row: IHeadquarters) => row.id,
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

  // Data fetching
  useEffect(() => {
    const fetchData = async () => {
      const params: SearchParams = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        query: searchQuery,
        sort: sorting[0]?.id,
        dir: sorting[0]?.desc ? 'desc' : 'asc',
      };

      const result = await getHeadquarters(params);
      setData(result);
    };

    startTransition(() => {
      fetchData();
    });
  }, [pagination.pageIndex, pagination.pageSize, searchQuery, sorting]);

  // CRUD handlers
  const handleSaveHeadquarter = async (headquartersData: IHeadquarters) => {
    try {
      const formData = new FormData();
      formData.append('avatar', headquartersData.avatar || '');
      formData.append('type', headquartersData.type);
      formData.append('identification', headquartersData.identification);
      formData.append('address', headquartersData.address);
      formData.append('reference', headquartersData.reference || '');
      formData.append('mobilePhone', headquartersData.mobilePhone);
      formData.append('homePhone', headquartersData.homePhone || '');
      formData.append('email', headquartersData.email);
      formData.append(
        'assignments',
        JSON.stringify(headquartersData.userAssignments || []),
      );

      if (headquartersData.id) {
        await updateHeadquarters(headquartersData.id, formData);
      } else {
        await createHeadquarters(formData);
      }

      // Refresh data
      const params: SearchParams = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        query: searchQuery,
        sort: sorting[0]?.id,
        dir: sorting[0]?.desc ? 'desc' : 'asc',
      };
      const result = await getHeadquarters(params);
      setData(result);

      setDialogOpen(false);
    } catch (error) {
      console.error('Error saving headquarters:', error);
      throw error;
    }
  };

  const handleDeleteHeadquarter = async () => {
    if (!deletingItem) return;

    try {
      setIsDeleting(true);
      await deleteHeadquarters(deletingItem.id);

      // Refresh data after deletion
      const params: SearchParams = {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        query: searchQuery,
        sort: sorting[0]?.id,
        dir: sorting[0]?.desc ? 'desc' : 'asc',
      };
      const result = await getHeadquarters(params);
      setData(result);
      setDeletingItem(null);
    } catch (error) {
      console.error('Error deleting headquarters:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewHeadquarter = (item: IHeadquarters) => {
    setViewingItem(item);
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleEditHeadquarter = (item: IHeadquarters) => {
    setEditingItem(item);
    setViewingItem(null);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 px-5 py-8 max-w-[1200px] mx-auto">
      <PageHeader
        title="Sedes"
        description="Gestiona las sedes de tu organización"
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setEditingItem(null);
              setViewingItem(null);
              setDialogOpen(true);
            }}
          >
            Nueva Sede
          </Button>
        }
      />

      <DataGrid
        table={table}
        recordCount={data?.total || 0}
        emptyMessage="Aún no se han registrado sedes."
        isLoading={isPending}
      >
        <Card>
          <CardHeader className="py-3">
            <CardTitle>
              {isPending
                ? 'Cargando...'
                : `Mostrando ${data?.headquarters?.length || 0} de ${data?.total || 0} sedes`}
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
                  placeholder="Buscar sedes"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputWrapper>
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

      <HeadquartersDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setEditingItem(null);
            setViewingItem(null);
          }
        }}
        initialValues={editingItem || viewingItem || initialValues}
        onSave={handleSaveHeadquarter}
        isReadOnly={!!viewingItem}
      />

      <ConfirmationDialog
        open={!!deletingItem}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeletingItem(null);
        }}
        title="Eliminar Sede"
        description={
          deletingItem
            ? `¿Estás seguro de que quieres eliminar ${deletingItem.type}? Esta acción no se puede deshacer.`
            : ''
        }
        onConfirm={handleDeleteHeadquarter}
        isLoading={isDeleting}
      />
    </div>
  );
}
