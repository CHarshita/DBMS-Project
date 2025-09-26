import { Outlet } from "react-router-dom";
import authBgImage from "../../assets/auth.jpg"; // <-- Corrected to .jpg extension

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* 2. Update the className to use the imported image and style it */}
      <div 
        className="hidden lg:flex items-center justify-center w-1/2 px-12"
        style={{
          backgroundImage: `url(${authBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // Optionally add an overlay effect if the image is too bright:
          position: 'relative',
        }}
      >
        {/* Optional: Add a dark overlay layer for better text readability */}
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

        <div className="max-w-md space-y-6 text-center text-primary-foreground z-10">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome to Go To Store
          </h1>
          {/* Add a subtle line/separator if you like */}
          <div className="h-1 w-20 mx-auto bg-primary-foreground rounded-full"></div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
