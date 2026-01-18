export default function CustomerGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="customer-layout">
            {children}
        </div>
    );
}
