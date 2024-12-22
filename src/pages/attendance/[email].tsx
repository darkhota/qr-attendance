import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

interface Props {
  email: string;
}

const AttendancePage = ({ email }: Props) => {
  const [status, setStatus] = useState<"loading" | "marked" | "onboarding">("loading");

  useEffect(() => {
    const markAttendance = async () => {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.status === 200) {
        setStatus("marked");
      } else if (response.status === 404) {
        setStatus("onboarding");
      }
    };

    markAttendance();
  }, [email]);

  if (status === "loading") return <p>Loading...</p>;

  return status === "marked" ? (
    <p>Attendance successfully marked for {email}!</p>
  ) : (
    <div>
      <h2>Onboarding</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const data = Object.fromEntries(formData.entries());
          await fetch("/api/onboard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          setStatus("marked");
        }}
      >
        <label>
          Name: <input name="name" required />
        </label>
        <label>
          Phone: <input name="phone" required />
        </label>
        <input type="hidden" name="email" value={email} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { email } = context.params!;
  return { props: { email } };
};

export default AttendancePage;