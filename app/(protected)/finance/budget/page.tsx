'use client';

import React from 'react';

export default function BudgetPage() {
  return (
    <div className="flex flex-col gap-8 px-5 py-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-[#111B37]">Presupuesto</h1>
        <div className="flex items-center gap-4">
          <span className="text-[15px] text-[#4B5675]">
            Gestiona el presupuesto de tu comunidad
          </span>
        </div>
      </div>
    </div>
  );
}
