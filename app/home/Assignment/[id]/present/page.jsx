"use client";
import { use, useState, useEffect } from 'react';

function page({ params }) {
    const { id } = use(params);
  return (
    <div>page{id}</div>
  )
}

export default page