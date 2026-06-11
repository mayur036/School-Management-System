import { toast } from 'sonner';

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
import { BASE } from '@/lib/icons';

import { useDeleteSchoolAdminMutation } from '../../schoolAdmins.api';

const DeleteAdminAlert = ({ admin, onClose }) => {
  const [deleteAdmin, { isLoading }] = useDeleteSchoolAdminMutation();

  const handleConfirm = async () => {
    if (!admin) return;
    try {
      await deleteAdmin(admin.staff_id).unwrap();
      toast.success('Admin deleted successfully');
      onClose();
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || 'Failed to delete admin'
      );
    }
  };

  return (
    <AlertDialog open={!!admin} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-2">
            <BASE.SHIELD_ALERT className="size-5" />
            Delete Admin
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to permanently delete{' '}
            <span className="text-foreground font-semibold">
              {admin?.first_name} {admin?.last_name}
            </span>
            ? This will instantly revoke their access and delete their login
            credentials. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer gap-2"
          >
            {isLoading && <BASE.LOADER className="size-4 animate-spin" />}
            {isLoading ? 'Deleting...' : 'Yes, Delete Admin'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAdminAlert;
