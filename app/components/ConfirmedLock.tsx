"useclient";
type ConfirmedLockProps = {
  value: any;
};

export default function ConfirmedLock({ value }: ConfirmedLockProps) {
  const abbr = value?.fieldValues?.find(
    (f: any) => f.name === "Abbr"
  )?.value;

  if (abbr !== "P") {
    return null;
  }

  return (
    <span
      title="Doklad je potvrzený"
      className="mr-2 inline-flex h-4 w-4 items-center justify-center rounded bg-green-100 text-green-700"
    >
      🔒
    </span>
  );
}