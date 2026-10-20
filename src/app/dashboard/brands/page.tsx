"use client";

import React, { useState } from "react";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Check,
  CheckCircle2,
  Phone,
  MapPin,
  Globe,
  Sparkles,
  Lock,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { useApp } from "@/context/app-context";
import { useToast } from "@/components/ui/toast";
import { BrandProfile, ContentLanguage, PLAN_CONFIGS } from "@/types/database";

export default function BrandsPage() {
  const {
    brands,
    activeBrandId,
    setActiveBrandId,
    createBrand,
    updateBrand,
    deleteBrand,
    organization,
  } = useApp();
  const toast = useToast();

  const planConfig = PLAN_CONFIGS[organization.plan_tier];
  const isLimitReached = brands.length >= planConfig.maxBrands;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandProfile | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    industry: "restaurant",
    description: "",
    products_services: "",
    target_audience: "",
    preferred_languages: ["tanglish", "tamil", "english"] as ContentLanguage[],
    brand_tone: "friendly_trendy" as any,
    contact_phone: "+91 98401 23456",
    whatsapp_number: "+91 98401 23456",
    instagram_handle: "@brand",
    location_address: "Chennai, Tamil Nadu",
    marketing_goals: "Drive footfall and increase social engagement",
    is_default: false,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      industry: "restaurant",
      description: "",
      products_services: "",
      target_audience: "",
      preferred_languages: ["tanglish", "tamil", "english"],
      brand_tone: "friendly_trendy",
      contact_phone: "+91 98401 23456",
      whatsapp_number: "+91 98401 23456",
      instagram_handle: "@brand",
      location_address: "Chennai, Tamil Nadu",
      marketing_goals: "Drive footfall and increase social engagement",
      is_default: false,
    });
  };

  const handleOpenAdd = () => {
    if (isLimitReached) {
      toast.error(
        `Your ${planConfig.name} plan allows up to ${planConfig.maxBrands} brand(s). Please upgrade to add more.`
      );
      return;
    }
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleSaveBrand = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a brand name.");
      return;
    }

    if (editingBrand) {
      updateBrand(editingBrand.id, formData);
      setEditingBrand(null);
    } else {
      const res = createBrand(formData);
      if (res.success) {
        setIsAddModalOpen(false);
      } else {
        toast.error(res.error || "Failed to create brand");
      }
    }
  };

  const handleEditClick = (brand: BrandProfile) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      industry: brand.industry,
      description: brand.description || "",
      products_services: brand.products_services || "",
      target_audience: brand.target_audience || "",
      preferred_languages: brand.preferred_languages || ["tanglish", "tamil"],
      brand_tone: brand.brand_tone || "friendly_trendy",
      contact_phone: brand.contact_phone || "",
      whatsapp_number: brand.whatsapp_number || "",
      instagram_handle: brand.instagram_handle || "",
      location_address: brand.location_address || "",
      marketing_goals: brand.marketing_goals || "",
      is_default: brand.is_default || false,
    });
  };

  const handleDeleteClick = (id: string) => {
    if (confirm("Are you sure you want to delete this brand workspace?")) {
      const res = deleteBrand(id);
      if (!res.success) {
        toast.error(res.error || "Could not delete brand");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Brand Workspaces
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your businesses, client accounts, brand voices, and contact numbers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500">
            <span>Quota: </span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {brands.length} / {planConfig.maxBrands} Brands
            </span>
          </div>

          <Button onClick={handleOpenAdd} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Add Brand Profile</span>
          </Button>
        </div>
      </div>

      {/* Brand Quota Notice */}
      {isLimitReached && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              You have reached your {planConfig.name} plan allowance of {planConfig.maxBrands} brand(s).
              Upgrade to Pro (3 brands) or Agency (10+ brands) to manage more client profiles.
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = "/dashboard/billing")}>
            Upgrade Plan
          </Button>
        </div>
      )}

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => {
          const isActive = brand.id === activeBrandId;

          return (
            <Card
              key={brand.id}
              className={`relative flex flex-col justify-between transition-all duration-200 ${
                isActive
                  ? "border-indigo-600 shadow-lg ring-2 ring-indigo-500/20"
                  : "hover:border-slate-300"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-base">
                      {brand.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-base truncate max-w-[180px]">
                        {brand.name}
                      </CardTitle>
                      <span className="text-xs text-slate-500 capitalize">
                        {brand.industry}
                      </span>
                    </div>
                  </div>

                  {isActive && (
                    <Badge variant="indigo" className="text-[10px]">
                      Active Workspace
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4 text-xs text-slate-600 dark:text-slate-400">
                <p className="line-clamp-2 leading-relaxed">
                  {brand.description || "No description provided."}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span className="capitalize">
                      {brand.preferred_languages?.join(", ") || "Tamil, Tanglish"}
                    </span>
                  </div>

                  {brand.whatsapp_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>{brand.whatsapp_number}</span>
                    </div>
                  )}

                  {brand.instagram_handle && (
                    <div className="flex items-center gap-2">
                      <InstagramIcon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <span>{brand.instagram_handle}</span>
                    </div>
                  )}

                  {brand.location_address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{brand.location_address}</span>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-3 gap-2">
                {!isActive ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveBrandId(brand.id)}
                    className="flex-1 text-xs"
                  >
                    Set as Active
                  </Button>
                ) : (
                  <div className="flex-1 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>In Use</span>
                  </div>
                )}

                <button
                  onClick={() => handleEditClick(brand)}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  title="Edit Brand"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => handleDeleteClick(brand.id)}
                  disabled={brands.length <= 1}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer disabled:opacity-40"
                  title="Delete Brand"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Add / Edit Brand Modal */}
      <Modal
        isOpen={isAddModalOpen || editingBrand !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingBrand(null);
        }}
        title={editingBrand ? `Edit "${editingBrand.name}"` : "Create New Brand Profile"}
        description="Set up your brand voice, industry, and contact details for AI context."
        maxWidth="xl"
      >
        <div className="space-y-4">
          <Input
            label="Brand Name"
            required
            placeholder="e.g. Velan Chettinad Mess"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Industry Category
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="restaurant">Restaurant / Mess / Cafe</option>
                <option value="clothing">Clothing & Silk Boutique</option>
                <option value="salon">Salon, Beauty & Spa</option>
                <option value="bakery">Bakery & Sweets</option>
                <option value="tuition">Tuition & Coaching</option>
                <option value="real_estate">Real Estate & Construction</option>
                <option value="retail">Retail / Electronics</option>
                <option value="agency">Marketing Agency</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Brand Tone
              </label>
              <select
                value={formData.brand_tone}
                onChange={(e) => setFormData({ ...formData, brand_tone: e.target.value as any })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="friendly_trendy">Trendy & Friendly (Vera Level)</option>
                <option value="traditional_respectful">Traditional & Respectful</option>
                <option value="premium_luxury">Premium & Luxury</option>
                <option value="urgent_promotional">Urgent / Promotional</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Business Description"
            rows={2}
            placeholder="Tell us what makes your business unique..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Input
            label="Key Products / Menu / Services"
            placeholder="e.g. Mutton Biryani, Nattu Kozhi Varuval, Filter Coffee"
            value={formData.products_services}
            onChange={(e) => setFormData({ ...formData, products_services: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="WhatsApp Number"
              placeholder="+91 98401 23456"
              value={formData.whatsapp_number}
              onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
            />

            <Input
              label="Instagram Handle"
              placeholder="@brandname"
              value={formData.instagram_handle}
              onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
            />
          </div>

          <Input
            label="Location / Store Address"
            placeholder="T. Nagar, Chennai"
            value={formData.location_address}
            onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
          />

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingBrand(null);
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveBrand}>
              {editingBrand ? "Update Brand" : "Save Brand Profile"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
