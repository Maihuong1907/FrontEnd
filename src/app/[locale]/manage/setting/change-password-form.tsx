'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import {
  ChangePasswordBody,
  ChangePasswordBodyType
} from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useChangePasswordMutation } from '@/queries/useAccount'
import { toast } from '@/components/ui/use-toast'
import {
  handleErrorApi,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage
} from '@/lib/utils'

export default function ChangePasswordForm() {
  const changePasswordMutation = useChangePasswordMutation()
  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  })
  const onSubmit = async (data: ChangePasswordBodyType) => {
    if (changePasswordMutation.isPending) return
    try {
      const result = await changePasswordMutation.mutateAsync(data)
      setAccessTokenToLocalStorage(result.payload.data.accessToken)
      setRefreshTokenToLocalStorage(result.payload.data.refreshToken)
      toast({
        description: result.payload.message
      })
      reset()
    } catch (error: any) {
      // Nếu có response từ API (ví dụ từ Axios hoặc fetch)
      const errors = error?.response?.data?.errors || error?.errors;

      if (errors && Array.isArray(errors)) {
        for (const err of errors) {
          // Đặt lỗi vào field (React Hook Form)
          form.setError(err.field, { message: err.message });

          // Nếu field là oldPassword → Hiển thị toast cảnh báo
          if (err.field === "oldPassword") {
            toast({
              variant: "destructive",
              description: err.message,
            });
           
          }
        }
      } else {
        // fallback khi không phải lỗi field
        toast({
          variant: "destructive",
          description:
            error?.response?.data?.message || "Đổi mật khẩu thất bại",
        });
      }
    }
  };
  const reset = () => {
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        noValidate
        className='grid auto-rows-max items-start gap-4 md:gap-8'
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={reset}
      >
        <Card className='overflow-hidden' x-chunk='dashboard-07-chunk-4'>
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
            {/* <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>
              <FormField
                control={form.control}
                name='oldPassword'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='oldPassword'>Mật khẩu cũ</Label>
                      <Input
                        autoComplete='current-password'
                        id='oldPassword'
                        type='password'
                        className='w-full'
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='password'>Mật khẩu mới</Label>
                      <Input
                        autoComplete='new-password'
                        id='password'
                        type='password'
                        className='w-full'
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='confirmPassword'>
                        Nhập lại mật khẩu mới
                      </Label>
                      <Input
                        autoComplete='new-password'
                        id='confirmPassword'
                        type='password'
                        className='w-full'
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className=' items-center gap-2 md:ml-auto flex'>
                <Button variant='outline' size='sm' type='reset'>
                  Hủy
                </Button>
                <Button size='sm' type='submit'>
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
