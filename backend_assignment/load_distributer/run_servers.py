import multiprocessing

import uvicorn


def run_server(port: int):
    uvicorn.run("app:app", host="0.0.0.0", port=port)


if __name__ == "__main__":
    ports = [8000, 8001, 8002, 8003]
    procs = []
    for p in ports:
        proc = multiprocessing.Process(target=run_server, args=(p,))
        proc.start()
        procs.append(proc)
    for proc in procs:
        proc.join()
