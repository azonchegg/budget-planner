import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/Dialog'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Label } from './ui/Label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Plus, Settings, Trash2, Edit2 } from 'lucide-react'
import { CustomCategory } from '../types'
import { generateId } from '../utils'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addCustomCategory, updateCustomCategory, deleteCustomCategory } from '../store/slices/settingsSlice'

const predefinedColors = [
  '#3B82F6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
  '#F97316',
  '#6366F1',
  '#F43F5E',
  '#8B5A2B',
  '#6B7280',
  '#14B8A6',
  '#A855F7'
]

export function CategoryManagement() {
  const dispatch = useAppDispatch()
  const { settings } = useAppSelector((state) => state.settings)
  const [isOpen, setIsOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState(predefinedColors[0])
  const [editingCategory, setEditingCategory] = useState<CustomCategory | null>(null)

  const addCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory: CustomCategory = {
      id: generateId(),
      name: newCategoryName.trim(),
      color: newCategoryColor
    }

    dispatch(addCustomCategory(newCategory))
    setNewCategoryName('')
    setNewCategoryColor(predefinedColors[0])
  }

  const updateCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) return

    dispatch(updateCustomCategory(editingCategory))
    setEditingCategory(null)
  }

  const deleteCategory = (categoryId: string) => {
    dispatch(deleteCustomCategory(categoryId))
  }

  const startEditing = (category: CustomCategory) => {
    setEditingCategory({ ...category })
  }

  const cancelEditing = () => {
    setEditingCategory(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Manage Categories
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Categories</DialogTitle>
            <DialogDescription>
              Add, edit, or remove custom expense categories. Changes will be applied immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Add New Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Category
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g., Gym Membership"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Color</Label>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {predefinedColors.map((color: string) => (
                        <button
                          key={color}
                          onClick={() => setNewCategoryColor(color)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            newCategoryColor === color ? 'border-gray-900' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <Button onClick={addCategory} disabled={!newCategoryName.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </CardContent>
            </Card>

            {/* Edit Category */}
            {editingCategory && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Edit2 className="h-5 w-5" />
                    Edit Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="editCategoryName">Category Name</Label>
                      <Input
                        id="editCategoryName"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Color</Label>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {predefinedColors.map((color: string) => (
                          <button
                            key={color}
                            onClick={() => setEditingCategory({ ...editingCategory, color })}
                            className={`w-8 h-8 rounded-full border-2 ${
                              editingCategory.color === color ? 'border-gray-900' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={updateCategory} disabled={!editingCategory.name.trim()}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Custom Categories List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Custom Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {settings.customCategories.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No custom categories yet. Add your first category above.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {settings.customCategories.map((category: CustomCategory) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(category)}
                            className="h-8 w-8"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteCategory(category.id)}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </DialogContent>
    </Dialog>
  )
}
