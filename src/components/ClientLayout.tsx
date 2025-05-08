"use client";

import React, { useState, useEffect, ReactNode } from "react";

interface ClientLayoutProps {
	children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		// Return a minimal placeholder to prevent layout shift
		return <div className="min-h-screen bg-black" />;
	}

	return <>{children}</>;
}
