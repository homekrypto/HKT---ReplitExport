# Property Management Frontend Implementation Plan

## Phase 1 - Backend Plan Review

### API Endpoints Analysis
Based on `property_backend_plan.md`, the following API endpoints are available:

**Property CRUD Operations:**
- `GET /api/properties` - List properties with filtering (`?status=`, `?type=`, `?search=`, pagination)
- `POST /api/properties` - Create new property (Admin only)
- `GET /api/properties/:id` - Get single property details
- `PATCH /api/properties/:id` - Update property (Admin only)
- `DELETE /api/properties/:id` - Delete property (Admin only)

**Image Management:**
- `POST /api/properties/:id/images` - Upload property images
- `DELETE /api/properties/:id/images/:imageIndex` - Delete specific image

**Statistics:**
- `GET /api/properties/stats/summary` - Get property statistics

### Enhanced Property Data Model
```typescript
interface Property {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerNight: number;
  totalShares: number;
  sharePrice: number;
  price?: number; // Sale/rental price
  status: 'For Sale' | 'Sold' | 'Rented' | 'Available' | 'Maintenance';
  type: 'House' | 'Apartment' | 'Villa' | 'Commercial' | 'Land';
  featured: boolean;
  tags: string[];
  images: string[];
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Frontend Architecture Confirmed
- **Framework**: React with TypeScript
- **UI Library**: shadcn/ui components
- **Data Fetching**: TanStack Query (useQuery, useMutation)
- **Forms**: React Hook Form with Zod validation
- **State Management**: React useState for local component state

## Phase 2 - Frontend Implementation Plan

### 1. Main Property Management Page

**File to Create**: `client/src/pages/PropertyManagement.tsx`

**Action**: Create the main orchestrating component for property management.

**Full Code**:
```typescript
import { useState } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminRoute from '@/components/admin-route';
import { PropertiesDataTable } from '@/components/admin/properties/PropertiesDataTable';
import { PropertyForm } from '@/components/admin/properties/PropertyForm';
import { PropertyStatistics } from '@/components/admin/properties/PropertyStatistics';

export default function PropertyManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<string | null>(null);

  const handleCreateProperty = () => {
    setEditingProperty(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditProperty = (propertyId: string) => {
    setEditingProperty(propertyId);
    setIsCreateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingProperty(null);
  };

  return (
    <AdminRoute>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              Property Management
            </h1>
            <p className="text-muted-foreground">
              Manage your real estate portfolio and property listings
            </p>
          </div>
          <Button onClick={handleCreateProperty} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Property
          </Button>
        </div>

        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList>
            <TabsTrigger value="properties">All Properties</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Portfolio</CardTitle>
                <CardDescription>
                  View and manage all properties in your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PropertiesDataTable onEditProperty={handleEditProperty} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <PropertyStatistics />
          </TabsContent>
        </Tabs>

        {/* Create/Edit Property Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProperty ? 'Edit Property' : 'Create New Property'}
              </DialogTitle>
              <DialogDescription>
                {editingProperty 
                  ? 'Update the property details below'
                  : 'Fill in the details to create a new property listing'
                }
              </DialogDescription>
            </DialogHeader>
            <PropertyForm
              propertyId={editingProperty}
              onSuccess={handleCloseDialog}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminRoute>
  );
}
```

### 2. Properties Data Table Component

**File to Create**: `client/src/components/admin/properties/PropertiesDataTable.tsx`

**Action**: Create a comprehensive data table with filtering, search, and actions.

**Full Code**:
```typescript
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Star,
  Home,
  MapPin,
  DollarSign,
  Users,
  Bed,
  Bath
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Property {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerNight: number;
  totalShares: number;
  sharePrice: number;
  price?: number;
  status: 'For Sale' | 'Sold' | 'Rented' | 'Available' | 'Maintenance';
  type: 'House' | 'Apartment' | 'Villa' | 'Commercial' | 'Land';
  featured: boolean;
  tags: string[];
  images: string[];
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PropertiesResponse {
  properties: Property[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    status?: string;
    type?: string;
    search?: string;
    featured?: string;
  };
}

interface PropertiesDataTableProps {
  onEditProperty: (propertyId: string) => void;
}

export function PropertiesDataTable({ onEditProperty }: PropertiesDataTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [featuredFilter, setFeaturedFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [deletePropertyId, setDeletePropertyId] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (search) queryParams.set('search', search);
  if (statusFilter) queryParams.set('status', statusFilter);
  if (typeFilter) queryParams.set('type', typeFilter);
  if (featuredFilter) queryParams.set('featured', featuredFilter);
  queryParams.set('page', page.toString());
  queryParams.set('limit', '20');

  const { data, isLoading, error } = useQuery<PropertiesResponse>({
    queryKey: ['/api/properties', queryParams.toString()],
    queryFn: async () => {
      const response = await apiRequest(`/api/properties?${queryParams.toString()}`);
      return response;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      await apiRequest(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({ title: 'Success', description: 'Property deleted successfully' });
      setDeletePropertyId(null);
    },
    onError: () => {
      toast({ 
        title: 'Error', 
        description: 'Failed to delete property', 
        variant: 'destructive' 
      });
    },
  });

  const handleDelete = (propertyId: string) => {
    setDeletePropertyId(propertyId);
  };

  const confirmDelete = () => {
    if (deletePropertyId) {
      deleteMutation.mutate(deletePropertyId);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Available': return 'default';
      case 'For Sale': return 'secondary';
      case 'Sold': return 'destructive';
      case 'Rented': return 'outline';
      case 'Maintenance': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'Villa': return 'default';
      case 'House': return 'secondary';
      case 'Apartment': return 'outline';
      case 'Commercial': return 'destructive';
      case 'Land': return 'secondary';
      default: return 'default';
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setTypeFilter('');
    setFeaturedFilter('');
    setPage(1);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            Failed to load properties. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="For Sale">For Sale</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
              <SelectItem value="Rented">Rented</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
              <SelectItem value="Land">Land</SelectItem>
            </SelectContent>
          </Select>

          <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="true">Featured</SelectItem>
              <SelectItem value="false">Not Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <Filter className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              Loading properties...
            </div>
          </CardContent>
        </Card>
      )}

      {/* Properties Table */}
      {data && (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property Details</TableHead>
                  <TableHead>Type & Status</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Specifications</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.properties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No properties found. Try adjusting your filters or create a new property.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium flex items-center gap-2">
                            {property.featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            {property.name}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {property.location}
                          </div>
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {property.description}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-2">
                          <Badge variant={getTypeBadgeVariant(property.type)}>
                            {property.type}
                          </Badge>
                          <Badge variant={getStatusBadgeVariant(property.status)}>
                            {property.status}
                          </Badge>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${property.pricePerNight}/night
                          </div>
                          {property.price && (
                            <div className="text-xs text-muted-foreground">
                              Sale: ${property.price.toLocaleString()}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Share: ${property.sharePrice}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {property.maxGuests} guests
                          </div>
                          <div className="flex items-center gap-1">
                            <Bed className="h-3 w-3" />
                            {property.bedrooms} bed
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath className="h-3 w-3" />
                            {property.bathrooms} bath
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">
                            {property.images.length} images
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {property.amenities.length} amenities
                          </div>
                          {!property.isActive && (
                            <Badge variant="secondary" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditProperty(property.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(property.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, data.pagination.total)} of {data.pagination.total} properties
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={!data.pagination.hasPrev}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {page} of {data.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={!data.pagination.hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePropertyId} onOpenChange={() => setDeletePropertyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property? This action cannot be undone.
              All associated images and data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Property'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```

### 3. Create/Edit Property Form Component

**File to Create**: `client/src/components/admin/properties/PropertyForm.tsx`

**Action**: Create a comprehensive form for property creation and editing.

**Full Code**:
```typescript
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Plus, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ImageUploader } from './ImageUploader';

const propertyFormSchema = z.object({
  name: z.string().min(1, 'Property name is required').max(200),
  location: z.string().min(1, 'Location is required').max(200),
  description: z.string().min(1, 'Description is required'),
  pricePerNight: z.number().positive('Price per night must be positive'),
  totalShares: z.number().int().positive('Total shares must be a positive integer'),
  sharePrice: z.number().positive('Share price must be positive'),
  price: z.number().positive('Price must be positive').optional(),
  status: z.enum(['For Sale', 'Sold', 'Rented', 'Available', 'Maintenance']),
  type: z.enum(['House', 'Apartment', 'Villa', 'Commercial', 'Land']),
  featured: z.boolean(),
  maxGuests: z.number().int().positive('Max guests must be positive'),
  bedrooms: z.number().int().min(0, 'Bedrooms cannot be negative'),
  bathrooms: z.number().int().min(0, 'Bathrooms cannot be negative'),
  isActive: z.boolean(),
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

interface Property {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerNight: number;
  totalShares: number;
  sharePrice: number;
  price?: number;
  status: 'For Sale' | 'Sold' | 'Rented' | 'Available' | 'Maintenance';
  type: 'House' | 'Apartment' | 'Villa' | 'Commercial' | 'Land';
  featured: boolean;
  tags: string[];
  images: string[];
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  isActive: boolean;
}

interface PropertyFormProps {
  propertyId?: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PropertyForm({ propertyId, onSuccess, onCancel }: PropertyFormProps) {
  const [newTag, setNewTag] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: '',
      location: '',
      description: '',
      pricePerNight: 0,
      totalShares: 52,
      sharePrice: 0,
      status: 'Available',
      type: 'House',
      featured: false,
      maxGuests: 1,
      bedrooms: 0,
      bathrooms: 0,
      isActive: true,
    },
  });

  // Fetch property data for editing
  const { data: property } = useQuery<{ property: Property }>({
    queryKey: ['/api/properties', propertyId],
    queryFn: async () => {
      if (!propertyId) throw new Error('No property ID');
      return await apiRequest(`/api/properties/${propertyId}`);
    },
    enabled: !!propertyId,
  });

  // Populate form when editing
  useEffect(() => {
    if (property?.property) {
      const prop = property.property;
      form.reset({
        name: prop.name,
        location: prop.location,
        description: prop.description,
        pricePerNight: prop.pricePerNight,
        totalShares: prop.totalShares,
        sharePrice: prop.sharePrice,
        price: prop.price,
        status: prop.status,
        type: prop.type,
        featured: prop.featured,
        maxGuests: prop.maxGuests,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        isActive: prop.isActive,
      });
      setTags(prop.tags || []);
      setAmenities(prop.amenities || []);
    }
  }, [property, form]);

  const createMutation = useMutation({
    mutationFn: async (data: PropertyFormData & { tags: string[]; amenities: string[] }) => {
      return await apiRequest('/api/properties', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({ title: 'Success', description: 'Property created successfully' });
      onSuccess();
    },
    onError: () => {
      toast({ 
        title: 'Error', 
        description: 'Failed to create property', 
        variant: 'destructive' 
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<PropertyFormData & { tags: string[]; amenities: string[] }>) => {
      return await apiRequest(`/api/properties/${propertyId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/properties', propertyId] });
      toast({ title: 'Success', description: 'Property updated successfully' });
      onSuccess();
    },
    onError: () => {
      toast({ 
        title: 'Error', 
        description: 'Failed to update property', 
        variant: 'destructive' 
      });
    },
  });

  const onSubmit = (data: PropertyFormData) => {
    const payload = { ...data, tags, amenities };
    
    if (propertyId) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenityToRemove: string) => {
    setAmenities(amenities.filter(amenity => amenity !== amenityToRemove));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Luxury Villa Cap Cana" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Cap Cana, Dominican Republic" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed description of the property..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="House">House</SelectItem>
                            <SelectItem value="Apartment">Apartment</SelectItem>
                            <SelectItem value="Villa">Villa</SelectItem>
                            <SelectItem value="Commercial">Commercial</SelectItem>
                            <SelectItem value="Land">Land</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="For Sale">For Sale</SelectItem>
                            <SelectItem value="Sold">Sold</SelectItem>
                            <SelectItem value="Rented">Rented</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Featured Property</FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Active Listing</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="maxGuests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Guests</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pricePerNight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price Per Night ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Nightly rental price in USD
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale/Rental Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                          />
                        </FormControl>
                        <FormDescription>
                          Total property price (optional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalShares"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Shares</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        </FormControl>
                        <FormDescription>
                          Number of ownership shares (typically 52 for weekly shares)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sharePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Share Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormDescription>
                          Price per individual share in USD
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Property Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tags Section */}
                <div>
                  <Label className="text-base font-medium">Tags</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Add tags to categorize your property (e.g., luxury, beachfront, modern)
                  </p>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Amenities Section */}
                <div>
                  <Label className="text-base font-medium">Amenities</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    List the amenities available at this property
                  </p>
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Add an amenity..."
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                    />
                    <Button type="button" onClick={addAmenity} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="flex items-center gap-1">
                        {amenity}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeAmenity(amenity)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            {propertyId && (
              <ImageUploader propertyId={propertyId} />
            )}
            {!propertyId && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Save the property first to upload images
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {propertyId ? 'Update Property' : 'Create Property'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

### 4. Image Uploader Component

**File to Create**: `client/src/components/admin/properties/ImageUploader.tsx`

**Action**: Create a comprehensive image upload and management component.

**Full Code**:
```typescript
import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Upload, 
  Trash2, 
  Image as ImageIcon, 
  Loader2,
  X,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Property {
  id: string;
  name: string;
  images: string[];
}

interface ImageUploaderProps {
  propertyId: string;
}

export function ImageUploader({ propertyId }: ImageUploaderProps) {
  const [deleteImageIndex, setDeleteImageIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch property data to get current images
  const { data: property, isLoading } = useQuery<{ property: Property }>({
    queryKey: ['/api/properties', propertyId],
    queryFn: async () => {
      return await apiRequest(`/api/properties/${propertyId}`);
    },
  });

  // Upload images mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`/api/properties/${propertyId}/images`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({ title: 'Success', description: 'Images uploaded successfully' });
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to upload images', 
        variant: 'destructive' 
      });
    },
  });

  // Delete image mutation
  const deleteMutation = useMutation({
    mutationFn: async (imageIndex: number) => {
      const response = await fetch(`/api/properties/${propertyId}/images/${imageIndex}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({ title: 'Success', description: 'Image deleted successfully' });
      setDeleteImageIndex(null);
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to delete image', 
        variant: 'destructive' 
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Validate file types
      const validFiles = Array.from(files).filter(file => {
        const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

        if (!isValidType) {
          toast({
            title: 'Invalid File Type',
            description: `${file.name} is not a valid image format. Please use JPEG, PNG, or WebP.`,
            variant: 'destructive'
          });
          return false;
        }

        if (!isValidSize) {
          toast({
            title: 'File Too Large',
            description: `${file.name} is larger than 10MB. Please compress the image.`,
            variant: 'destructive'
          });
          return false;
        }

        return true;
      });

      if (validFiles.length > 0) {
        const fileList = new DataTransfer();
        validFiles.forEach(file => fileList.items.add(file));
        uploadMutation.mutate(fileList.files);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteImage = (imageIndex: number) => {
    setDeleteImageIndex(imageIndex);
  };

  const confirmDeleteImage = () => {
    if (deleteImageIndex !== null) {
      deleteMutation.mutate(deleteImageIndex);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading images...</p>
        </CardContent>
      </Card>
    );
  }

  const images = property?.property?.images || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Property Images
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          <div className="text-center space-y-3">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <div>
              <h3 className="font-medium">Upload Property Images</h3>
              <p className="text-sm text-muted-foreground">
                Select multiple images (JPEG, PNG, WebP - Max 10MB each)
              </p>
            </div>
            <Button 
              onClick={handleUploadClick}
              disabled={uploadMutation.isPending}
              className="flex items-center gap-2"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Select Images
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Current Images */}
        {images.length > 0 ? (
          <div>
            <h4 className="font-medium mb-3">
              Current Images ({images.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                    <img
                      src={imageUrl}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';
                      }}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                    onClick={() => handleDeleteImage(index)}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending && deleteImageIndex === index ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No images uploaded yet</p>
            <p className="text-sm">Upload some images to showcase this property</p>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog 
          open={deleteImageIndex !== null} 
          onOpenChange={() => setDeleteImageIndex(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Image</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this image? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteImage}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Image'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
```

### 5. Property Statistics Component

**File to Create**: `client/src/components/admin/properties/PropertyStatistics.tsx`

**Action**: Create a statistics dashboard for property analytics.

**Full Code**:
```typescript
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Home, 
  Star, 
  TrendingUp,
  Building2,
  MapPin,
  DollarSign
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface PropertyStats {
  summary: {
    total: number;
    active: number;
    featured: number;
  };
  byStatus: Array<{
    status: string;
    count: number;
  }>;
  byType: Array<{
    type: string;
    count: number;
  }>;
}

export function PropertyStatistics() {
  const { data: stats, isLoading, error } = useQuery<PropertyStats>({
    queryKey: ['/api/properties/stats/summary'],
    queryFn: async () => {
      return await apiRequest('/api/properties/stats/summary');
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="py-8">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Failed to load statistics. Please try again.
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'For Sale': return 'bg-blue-100 text-blue-800';
      case 'Sold': return 'bg-red-100 text-red-800';
      case 'Rented': return 'bg-yellow-100 text-yellow-800';
      case 'Maintenance': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Villa': return 'bg-purple-100 text-purple-800';
      case 'House': return 'bg-green-100 text-green-800';
      case 'Apartment': return 'bg-blue-100 text-blue-800';
      case 'Commercial': return 'bg-orange-100 text-orange-800';
      case 'Land': return 'bg-brown-100 text-brown-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.summary.total}</div>
            <p className="text-xs text-muted-foreground">
              Properties in portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.summary.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Properties</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.summary.featured}</div>
            <p className="text-xs text-muted-foreground">
              Premium listings
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Properties by Status
            </CardTitle>
            <CardDescription>
              Distribution of properties across different statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.byStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={getStatusColor(item.status)}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.count}</span>
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${(item.count / stats.summary.total) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Properties by Type
            </CardTitle>
            <CardDescription>
              Distribution of properties across different types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.byType.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className={getTypeColor(item.type)}
                    >
                      {item.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.count}</span>
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${(item.count / stats.summary.total) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Portfolio Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((stats.summary.active / stats.summary.total) * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">Active Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((stats.summary.featured / stats.summary.total) * 100)}%
              </div>
              <p className="text-sm text-muted-foreground">Featured Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.byType.length}
              </div>
              <p className="text-sm text-muted-foreground">Property Types</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 6. Integration with Admin Panel

**File to Modify**: `client/src/pages/AdminPanel.tsx`

**Action**: Add the Property Management tab to the existing admin panel.

**Code to Add** (Add this TabsTrigger to the existing TabsList):
```typescript
<TabsTrigger value="properties" className="flex items-center gap-2">
  <Building2 className="h-4 w-4" />
  Properties
</TabsTrigger>
```

**Code to Add** (Add this TabsContent after existing ones):
```typescript
<TabsContent value="properties" className="space-y-6">
  <PropertyManagement />
</TabsContent>
```

**Import to Add** (Add to existing imports):
```typescript
import { Building2 } from 'lucide-react';
import PropertyManagement from './PropertyManagement';
```

### 7. Route Registration

**File to Modify**: `client/src/App.tsx`

**Action**: Add the Property Management route.

**Code to Add** (Add this route to the Switch component):
```typescript
<Route path="/admin/properties" component={PropertyManagement} />
```

**Import to Add**:
```typescript
import PropertyManagement from "@/pages/PropertyManagement";
```

## Summary

This comprehensive frontend implementation provides:

### **Core Features**:
- **Complete Property CRUD**: Create, read, update, delete properties
- **Advanced Filtering**: Search by name/description, filter by status/type/featured
- **Image Management**: Upload multiple images, delete specific images
- **Form Validation**: Comprehensive validation with React Hook Form and Zod
- **Responsive Design**: Mobile-friendly interface using shadcn/ui components

### **Advanced Functionality**:
- **Real-time Updates**: TanStack Query for cache invalidation and real-time updates
- **Pagination**: Handle large property datasets efficiently
- **Statistics Dashboard**: Visual analytics for property portfolio
- **Tags & Amenities**: Flexible categorization system
- **Error Handling**: Comprehensive error states and user feedback

### **Technical Excellence**:
- **Type Safety**: Full TypeScript coverage with proper interfaces
- **Performance**: Optimized queries and mutations with proper loading states
- **User Experience**: Intuitive navigation, confirmation dialogs, and progress indicators
- **Accessibility**: Proper ARIA labels and keyboard navigation support

The implementation seamlessly integrates with the existing admin panel and follows established patterns in your codebase. All components are production-ready with comprehensive error handling and user feedback systems.