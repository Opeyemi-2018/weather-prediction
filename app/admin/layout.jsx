import Sidebar from "../components/sidebar"


const AdminLayout = ({children}) => {
  return (
    <section className=" mx-auto h-screen">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className=" xl:pl-[290px] min-h-screen lg:pl-[274px] lg:pr-6 xl:pr-10 lg:pt-[29px] md:p-6 p-4 bg-[#f8f6f4]">
        {children}
      </div>
    </section>
  )
}

export default AdminLayout