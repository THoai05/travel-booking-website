"use client";
import { Button } from "primereact/button";


export default function AdminFAQPage() {
    return (
        <div>
            <div className="flex justify-between items-center p-6 space-y-6">
                <div>
                    <h1 className="text-black font-bold text-2xl">Quản lý FAQ</h1>
                    <p>Quản lý câu hỏi thường gặp hiển thị cho khách hàng </p>
                </div>
                <>
                    <Button label="Thêm câu hỏi"
                        icon="pi pi-plus"
                        iconPos="left" className="!bg-black !rounded-lg !text-white font-semibold justify-center items-center shadow-md border !border-gray-200 hover:scale-105 transition" />
                </>
            </div>
            <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
                <div className="flex justify-between items-center pb-5">
                    <h1 className=""><span className="pi pi-question-circle mr-2"></span>Danh sách câu hỏi</h1>
                    <div className="w-20 h-auto bg-gray-200 text-black items-center justify-center rounded-2xl pl-1"> 3 câu hỏi</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl mb-5">
                    <div className="m-5">
                        <h1 className="text-xl font-semibold">Làm thế nào để đặt phòng khách sạn?</h1>
                        <p>Bạn có thể đặt phòng qua website của chúng tôi, gọi điện trực tiếp đến số hotline 1900-1234, hoặc đến trực tiếp tại quầy lễ tân</p>
                        <hr className="my-6 border-t border-gray-300" />
                        <div className="flex justify-between items-center">
                            <p>Tạo: 10/1/2024 . Cập nhật: 15/1/2024 . ID: #1  </p>
                            <div className="flex !mr-2 !space-x-2">
                                <Button label="Ẩn" icon="pi pi-eye-slash" iconPos="left" className="!bg-white w-22 h-10 !text-black flex justify-between items-center border !border-gray-200" />
                                <Button label="Sửa" icon="pi pi-file-edit" iconPos="left" className="!bg-white w-22 h-10 !text-black flex justify-between items-center pl-2 border !border-gray-200" />
                                <Button label="Xóa" icon="pi pi-trash" iconPos="left" className="!bg-red-500 w-22 h-10 flex justify-between items-center border !border-gray-200" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl mb-5">
                    <div className="m-5">
                        <h1 className="text-xl font-semibold">Làm thế nào để đặt phòng khách sạn?</h1>
                        <p>Bạn có thể đặt phòng qua website của chúng tôi, gọi điện trực tiếp đến số hotline 1900-1234, hoặc đến trực tiếp tại quầy lễ tân</p>
                        <hr className="my-6 border-t border-gray-300" />
                        <div className="flex justify-between items-center">
                            <p>Tạo: 10/1/2024 . Cập nhật: 15/1/2024 . ID: #2  </p>
                            <div className="flex !mr-2 !space-x-2">
                                <Button label="Ẩn" icon="pi pi-eye-slash" iconPos="left" className="!bg-white w-22 h-10 !text-black flex justify-between items-center border !border-gray-200" />
                                <Button label="Sửa" icon="pi pi-file-edit" iconPos="left" className="!bg-white w-22 h-10 !text-black flex justify-between items-center pl-2 border !border-gray-200" />
                                <Button label="Xóa" icon="pi pi-trash" iconPos="left" className="!bg-red-500 w-22 h-10 flex justify-between items-center border !border-gray-200" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl mb-5">
                    <div className="m-5">
                        <h1 className="text-xl font-semibold">Làm thế nào để đặt phòng khách sạn?</h1>
                        <p>Bạn có thể đặt phòng qua website của chúng tôi, gọi điện trực tiếp đến số hotline 1900-1234, hoặc đến trực tiếp tại quầy lễ tân</p>
                        <hr className="my-6 border-t border-gray-300" />
                        <div className="flex justify-between items-center">
                            <p>Tạo: 10/1/2024 . Cập nhật: 15/1/2024 . ID: #3  </p>
                            <div className="flex !mr-2 !space-x-2">
                                <Button label="Ẩn" icon="pi pi-eye-slash" iconPos="left" className="!bg-white w-22 h-10 !text-black flex justify-between items-center border !border-gray-200" />
                                <Button label="Sửa" icon="pi pi-file-edit" iconPos="left" className="!bg-white w-22 h-10 !text-black flex justify-between items-center pl-2 border !border-gray-200" />
                                <Button label="Xóa" icon="pi pi-trash" iconPos="left" className="!bg-red-500 w-22 h-10 flex justify-between items-center border !border-gray-200" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl mb-5">
                    <div className="m-5">
                        <h1 className="text-xl font-semibold">Làm thế nào để đặt phòng khách sạn?</h1>
                        <p>Bạn có thể đặt phòng qua website của chúng tôi, gọi điện trực tiếp đến số hotline 1900-1234, hoặc đến trực tiếp tại quầy lễ tân</p>
                        <hr className="my-6 border-t border-gray-300" />
                        <div className="flex justify-between items-center">
                            <p>Tạo: 10/1/2024 . Cập nhật: 15/1/2024 . ID: #4  </p>
                            <div className="flex !mr-2 !space-x-2">
                                <Button label="Ẩn" icon="pi pi-eye-slash" iconPos="left" className="!bg-white w-22 h-10 !text-black flex justify-between items-center border !border-gray-200" />
                                <Button label="Sửa" icon="pi pi-file-edit" iconPos="left" className="!bg-white w-22 h-10 !text-black flex justify-between items-center pl-2 border !border-gray-200" />
                                <Button label="Xóa" icon="pi pi-trash" iconPos="left" className="!bg-red-500 w-22 h-10 flex justify-between items-center border !border-gray-200" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}