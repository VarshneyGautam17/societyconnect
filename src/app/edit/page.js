'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { defaultVendor } from '@/data/businesses';
import { setVendor } from '@/store/slices/vendorSlice';
import { useToast } from '@/components/ui/Toast';
import PreviewCard from '@/components/ui/PreviewCard';
import TopBar from '@/components/edit/TopBar';
import BasicInfoForm from '@/components/edit/BasicInfoForm';
import PhotoManager from '@/components/edit/PhotoManager';
import ItemsEditor from '@/components/edit/ItemsEditor';
import HoursEditor from '@/components/edit/HoursEditor';
import ServedContactPanel from '@/components/edit/ServedContactPanel';
import OffersForm from '@/components/edit/OffersForm';

export default function EditPage() {
  const dispatch = useDispatch();
  const toast = useToast();
  const storedVendor = useSelector((state) => state.vendor.current);

  const [v, setV] = useState(() => (storedVendor ? JSON.parse(JSON.stringify(storedVendor)) : defaultVendor()));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    function onBeforeUnload(e) {
      if (dirty) { e.preventDefault(); e.returnValue = ''; }
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  function patch(partial) {
    setV((prev) => ({ ...prev, ...partial }));
    setDirty(true);
  }

  function onPublish() {
    if (!v.name.trim()) { toast('Please add a business name first.'); return; }
    if (!v.served?.length) { toast('Choose at least one society you serve.'); return; }
    if (!v.whatsapp?.trim()) { toast('Add a WhatsApp number.'); return; }
    if (!v.phone?.trim()) { toast('Add a phone number.'); return; }
    const items = v.items.filter((r) => r[0].trim());
    if (!items.length) { toast('Add at least one product or service.'); return; }
    const published = { ...v, items, society: v.served[0] || v.society, published: true };
    setV(published);
    dispatch(setVendor(published));
    setDirty(false);
    toast('Published. Your page is updated for residents.');
  }

  function onPreviewClick(e) {
    if (!storedVendor || !storedVendor.published) {
      e.preventDefault();
      toast('Publish your page first, then you can preview it as a resident.');
    } else if (dirty) {
      toast('Showing your last published version. Publish to include new edits.');
    }
  }

  const previewVendor = { ...v, id: 'preview', society: v.served[0] || v.society, verified: false };

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <TopBar name={v.name} published={v.published} dirty={dirty} onPreviewClick={onPreviewClick} onPublish={onPublish} />
      <main className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 pt-6 pb-16 items-start flex-1">
        <div className="flex flex-col gap-6">
          <BasicInfoForm v={v} patch={patch} />
          <PhotoManager v={v} patch={patch} />
          <ItemsEditor items={v.items} onChange={(items) => patch({ items })} />
          <HoursEditor hours={v.hours} onChange={(hours) => patch({ hours })} />
          <ServedContactPanel v={v} patch={patch} />
          <OffersForm v={v} patch={patch} />
        </div>
        <aside className="flex flex-col gap-3 lg:sticky lg:top-24">
          <h2 className="font-label-lg text-label-lg font-bold text-on-surface">Live preview, as residents see it</h2>
          <PreviewCard business={previewVendor} />
          <div className="bg-primary-fixed text-primary rounded-2xl px-4 py-3.5 font-body-sm text-body-sm leading-relaxed">
            Changes go live only when you tap Publish changes. Nothing is published silently.
          </div>
        </aside>
      </main>
    </div>
  );
}
